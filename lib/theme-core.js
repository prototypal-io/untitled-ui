/* jshint node: true */
'use strict';

var path = require('path');

var Resolver = require('./resolver');
var scssPreprocessor = require('./scss-preprocessor');
var jsPreprocessor = require('./component-preprocessor/js');
var templatePreprocessor = require('./component-preprocessor/templates');

function ThemeCore() {
  this.themes = [];
  this.parentTheme = null;
  this.didSetup = false;
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
    this.didSetup = this.didSetup || this.setup(registry);
  },

  setup: function(registry) {
    this.setupCss(registry);
    this.setupJs(registry);
    this.setupTemplates(registry);
    return true;
  },

  setupCss: function(registry) {
    registry.add('css', {
      name: 'mixin-classes',
      options: this._preprocessorOptions(),
      toTree: function(tree) {
        return scssPreprocessor(tree, this.options);
      }
    });
  },

  setupJs: function(registry) {
    registry.add('js', {
      name: 'generate-components-for-scss',
      options: this._preprocessorOptions(),
      toTree: function(tree) {
        var destDir = tree.destDir || (tree.inputTree && tree.inputTree.destDir);
        var isTests = /tests$/.test(destDir);
        if (isTests) { return tree; };

        return jsPreprocessor(tree, this.options);
      }
    });
  },

  setupTemplates: function(registry) {
    registry.add('template', {
      name: 'generate-templates-for-scss',
      options: this._preprocessorOptions(),
      toTree: function(tree) {
        return templatePreprocessor(tree, this.options);
      }
    });
  },

  _preprocessorOptions: function() {
    return {
      themes: this.themes,
      moduleNamespace: this.moduleNamespace,
      stylesNamespace: this.stylesNamespace,
      componentsNamespace: this.componentsNamespace,
      templatesNamespace: this.templatesNamespace,
      resolver: this.resolver
    };
  }
};

module.exports = ThemeCore;
