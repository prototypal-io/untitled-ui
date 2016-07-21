/* jshint node: true */
'use strict';

var path = require('path');

var Addon = require('ember-cli/lib/models/addon');
var ThemeCore = require('./lib/theme-core');
var TransformComponentClasses = require('./lib/htmlbars-plugins/transform-component-classes');
var TransformUITableComponents = require('./lib/htmlbars-plugins/transform-ui-table-components');
var funnel = require('broccoli-funnel');

var themeCore;

var Theme = Addon.extend({
  themeCore: null,
  parentTheme: null,
  didSetupThemeCore: false,

  isDevelopingAddon: function() {
    return true;
  },

  init: function() {
    // set this theme's parent theme that was saved on themeCore
    // from the super class, then set the parent theme to the
    // current theme for the next sub class
    this.parentTheme = this.themeCore.parentTheme;
    this.themeCore.parentTheme = this;

    this.themeCore.register(this);
  },

  setupPreprocessorRegistry: function(type, registry) {
    // this hook runs before init for type === 'self'
    // so we need to setup the theme here but only do it once
    this.didSetupThemeCore = this.didSetupThemeCore || this.setupThemeCore(registry);

    if (type === 'parent' && !registry.app.parent) {
      this.themeCore.setupAppPreprocessors(registry);
    }

    if (type === 'self') {
      this.themeCore.setupThemePreprocessors(registry, this.name);
      this.setupHtmlTransforms(registry);
    }
  },

  setupThemeCore: function(registry) {
    // only instantiate once themeCore for all themes
    this.themeCore = themeCore || new ThemeCore({
      projectName: registry.app.project.pkg.name
    });
    themeCore = this.themeCore;

    return true;
  },

  setupHtmlTransforms: function(registry) {
    registry.add('htmlbars-ast-plugin', {
      name: 'transform-component-classes',
      plugin: TransformComponentClasses
    });

    registry.add('htmlbars-ast-plugin', {
      name: 'transform-ui-table-components',
      plugin: TransformUITableComponents
    });
  },

  scssPath: 'addon/styles',
  toScssTree: function() {
    var scssDir = path.join(this._baseDiskDir(), this.scssPath);
    var tree = this.treeGenerator(scssDir);
    return funnel(tree, { include: ['**/*.scss'] });
  },

  jsPath: 'addon',
  toJsTree: function() {
    var jsDir = path.join(this._baseDiskDir(), this.jsPath);
    var tree = this.treeGenerator(jsDir);
    return funnel(tree, { include: ['**/*.js'] });
  },

  hbsPath: 'addon/templates',
  toHbsTree: function() {
    var hbsDir = path.join(this._baseDiskDir(), this.hbsPath);
    var tree = this.treeGenerator(hbsDir);
    return funnel(tree, { include: ['**/*.hbs'] });
  },

  _baseDiskDir: function() {
    return this.nodeModulesPath.replace(/\/node_modules$/, '');
  }
});

module.exports = Theme;
