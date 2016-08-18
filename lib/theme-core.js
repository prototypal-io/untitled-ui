/* jshint node: true */
'use strict';

var path = require('path');

var Resolver = require('./resolver');
var scssPreprocessor = require('./scss-preprocessor');
var appJsPreprocessor = require('./component-preprocessor/app-js');
var themesJsPreprocessor = require('./component-preprocessor/themes-js');
var themesTemplatePreprocessor = require('./component-preprocessor/themes-templates');

function ThemeCore(options) {
  this.appName = options.appName;
  this.themes = [];
  this.parentTheme = null;
  this.didSetupApp = false;
  this.didSetupThemes = false;
  this.didSetupServerMiddleware = false;
  this.moduleNamespace = 'modules';
  this.stylesNamespace = 'styles';
  this.componentsNamespace = 'components';
  this.templatesNamespace = 'templates';

  this.resolver = new Resolver({
    moduleNamespace: this.moduleNamespace,
    stylesNamespace: this.stylesNamespace,
    componentsNamespace: this.componentsNamespace,
    templatesNamespace: this.templatesNamespace
  });
}

ThemeCore.prototype = {
  register: function(theme) {
    var registeredThemeNames = this.themes.map(function(theme) {
      return theme.name;
    });

    // only register themes once (in the case of running dummy app inside of a theme)
    if (registeredThemeNames.indexOf(theme.name) === -1) {
      this.themes.push(theme);
    }
  },

  setupAppPreprocessors: function(registry) {
    // only setup once (in the case of running dummy app inside of a theme)
    this.didSetupApp = this.didSetupApp || this.setupApp(registry);
  },

  setupApp: function(registry) {
    this.setupAppCss(registry);
    this.setupAppJs(registry);
    return true;
  },

  setupAppCss: function(registry) {
    registry.add('css', {
      name: 'mixin-classes',
      options: this._preprocessorOptions(),
      toTree: function(tree) {
        return scssPreprocessor(tree, this.options);
      }
    });
  },

  setupAppJs: function(registry) {
    registry.add('js', {
      name: 'generate-application-components-for-scss',
      options: this._preprocessorOptions(),
      toTree: function(tree) {
        if (isTestTree(tree)) { return tree; }

        return appJsPreprocessor(tree, this.options);
      }
    });
  },

  setupThemePreprocessors: function(registry, themeName) {
    this.setupThemesJs(registry, themeName);
    this.setupThemesTemplates(registry, themeName);
  },

  setupThemesJs: function(registry, themeName) {
    registry.add('js', {
      name: 'generate-theme-components-for-scss',
      options: this._preprocessorOptions(),
      toTree: function(tree) {
        if (isTestTree(tree)) { return tree; }

        return themesJsPreprocessor(tree, themeName, this.options);
      }
    });
  },

  setupThemesTemplates: function(registry, themeName) {
    registry.add('template', {
      before: 'ember-cli-htmlbars',
      name: 'generate-templates-for-scss',
      options: this._preprocessorOptions(),
      toTree: function(tree) {
        return themesTemplatePreprocessor(tree, themeName, this.options);
      }
    });
  },

  _preprocessorOptions: function() {
    return {
      appName: this.appName,
      themes: this.themes,
      moduleNamespace: this.moduleNamespace,
      stylesNamespace: this.stylesNamespace,
      componentsNamespace: this.componentsNamespace,
      templatesNamespace: this.templatesNamespace,
      resolver: this.resolver
    };
  }
};

function isTestTree(tree) {
  var destDir = tree.destDir || (tree.inputTree && tree.inputTree.destDir);
  return /tests$/.test(destDir);
}

module.exports = ThemeCore;
