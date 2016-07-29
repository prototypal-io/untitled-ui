/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');

var Addon = require('ember-cli/lib/models/addon');
var ThemeCore = require('./lib/theme-core');
var TransformComponentClasses = require('./lib/htmlbars-plugins/transform-component-classes');
var TransformUITableComponents = require('./lib/htmlbars-plugins/transform-ui-table-components');
var funnel = require('broccoli-funnel');
var bodyParser = require('body-parser');
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
      plugin: TransformComponentClasses
    });

    registry.add('htmlbars-ast-plugin', {
      name: 'transform-ui-table-components',
      plugin: TransformUITableComponents
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

  serverMiddleware: function(config) {
    var app = config.app;
    var themeCore = this.themeCore;

    // do we want the body parser middleware for all
    // routes or just the route defined below?
    // i believe there's a way to just add it to that one
    // @heroiceric
    app.use(bodyParser.json());

    app.get('/__ui/components', function(req, res, next) {
      // var demoComponents =
      //   fs.readdirSync(path.join(project.root, 'addon', 'components'))
      //   .filter(function(component) {
      //     return /^demo--(.*).js$/.test(component);
      //   })
      //   .slice(1);

      // var components = demoComponents.map(function(demoComponent) {
      //   return {
      //     demoComponent: demoComponent.replace('.js', ''),
      //     name: demoComponent.match(/^demo--(.*).js$/)[1]
      //   };
      // });

      // something like this: it will give you all of the js components
      // for all the themes, then do with them what you please
      // you could also get all the scss and hbs files too if needed
      var components = themeCore.themes.map(function(theme) {
        return theme.toJsComponentFilesArray();
      });

      res.set('Content-Type', 'application/json');
      res.json(components);

      next();
    });
  },

  toJsComponentFilesArray: function() {
    var scssDir = path.join(this._baseDiskDir(), this.jsPath);
    return walkSync(scssDir, { globs: ['components/*.js'] });
  },

  _baseDiskDir: function() {
    return this.nodeModulesPath.replace(/\/node_modules$/, '');
  },
});

module.exports = Theme;
