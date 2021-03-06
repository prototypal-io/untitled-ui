/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');

var Addon = require('ember-cli/lib/models/addon');
var ThemeCore = require('./lib/theme-core');
var TransformComponentClasses = require('./lib/htmlbars-plugins/transform-component-classes');
var TransformUIRoot = require('./lib/htmlbars-plugins/transform-ui-root');
var TransformUITableComponents = require('./lib/htmlbars-plugins/transform-ui-table-components');
var StyleguideServer = require('./lib/server-middleware/styleguide-server');
var funnel = require('broccoli-funnel');
var walkSync = require('walk-sync');

var themeCore;

var Theme = Addon.extend({
  themeCore: null,
  parentTheme: null,
  jsPath: 'addon',
  scssPath: 'addon/styles',
  hbsPath: 'addon/templates',

  isDevelopingAddon: function() {
    return true;
  },

  init: function() {
    this._super.init && this._super.init.apply(this, arguments);

    // set this theme's parent theme that was saved on themeCore
    // from the super class, then set the parent theme to the
    // current theme for the next sub class
    this.parentTheme = this.themeCore.parentTheme;
    this.themeCore.parentTheme = this;

    this.themeCore.register(this);
  },

  setupPreprocessorRegistry: function(type, registry) {
    // only instantiate themeCore once for all themes
    this.themeCore = themeCore || new ThemeCore({
      appName: registry.app.project.pkg.name
    });
    themeCore = this.themeCore;

    // if we're running inside any theme/subtheme's dummy app
    // then the appName is not the project.pkg.name, it's "dummy"
    if (this.name === this.themeCore.appName) {
      this.themeCore.appName = 'dummy';
    }

    if (type === 'parent' && !registry.app.parent) {
      this.themeCore.setupAppPreprocessors(registry);
    }

    if (type === 'self') {
      this.themeCore.setupThemePreprocessors(registry, this.name);
      this.setupHtmlTransforms(registry);
    }
  },

  setupHtmlTransforms: function(registry) {
    registry.add('htmlbars-ast-plugin', {
      name: 'transform-component-classes',
      plugin: TransformComponentClasses,
      baseDir: function() { return __dirname }
    });

    registry.add('htmlbars-ast-plugin', {
      name: 'transform-ui-root',
      plugin: TransformUIRoot,
      baseDir: function() { return __dirname }
    });

    registry.add('htmlbars-ast-plugin', {
      name: 'transform-ui-table-components',
      plugin: TransformUITableComponents,
      baseDir: function() { return __dirname }
    });
  },

  toScssTree: function() {
    var scssDir = path.join(this._baseDiskDir(), this.scssPath);
    var tree = this.treeGenerator(scssDir);
    return funnel(tree, { include: ['**/*.scss'] });
  },

  toJsTree: function() {
    var jsDir = path.join(this._baseDiskDir(), this.jsPath);
    var tree = this.treeGenerator(jsDir);
    return funnel(tree, { include: ['**/*.js'] });
  },

  toHbsTree: function() {
    var hbsDir = path.join(this._baseDiskDir(), this.hbsPath);
    var tree = this.treeGenerator(hbsDir);
    return funnel(tree, { include: ['**/*.hbs'] });
  },

  shouldAddServerMiddleware(themeCore) {
    return !themeCore.didSetupServerMiddleware;
  },

  serverMiddleware: function(startOptions) {
    if (this.shouldAddServerMiddleware(this.themeCore)) {
      var styleguideServer = new StyleguideServer({ themeCore: this.themeCore });
      styleguideServer.addServerMiddleware(startOptions);

      themeCore.didSetupServerMiddleware = true;
    }
  },

  toJsComponentFilesArray: function() {
    var jsDir = path.join(this._baseDiskDir(), this.jsPath);
    return walkSync(jsDir, { globs: ['components/*.js'] });
  },

  toScssComponentFilesArray: function() {
    var scssDir = path.join(this._baseDiskDir(), this.scssPath);
    return walkSync(scssDir, { globs: ['components/*.scss'] });
  },

  _baseDiskDir: function() {
    return this.nodeModulesPath.replace(/\/node_modules$/, '');
  }
});

module.exports = Theme;
