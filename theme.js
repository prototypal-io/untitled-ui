/* jshint node: true */
'use strict';

var Addon = require('ember-cli/lib/models/addon');

var path = require('path');
var csso = require('broccoli-csso');

var jsPreprocessor = require('./lib/js-preprocessor');
var templatePreprocessor = require('./lib/template-preprocessor');
var scssPreprocessor = require('./lib/scss-preprocessor');

var TransformComponentClasses = require('./lib/transform-component-classes');
var TransformUITableComponents = require('./lib/plugins/transform-ui-table-components');

var UITheme = Addon.extend({
  setupPreprocessorRegistry: function(type, registry) {
    this.setupJsPreprocessing(registry, type);

    if (type === 'self') {
      this.setupTemplatePreprocessing(registry);
      this.setupCssPreprocessing(registry);
      this.setupHtmlTransform(registry);
    }

    registry.add('htmlbars-ast-plugin', {
      name: 'transform-ui-table-components',
      plugin: TransformUITableComponents
    });
  },

  setupJsPreprocessing: function(registry, type) {
    registry.add('js', {
      name: 'generate-components-for-scss',
      ext: 'scss',
      _addon: this,
      toTree: function(tree) {
        var destDir = tree.destDir || (tree.inputTree && tree.inputTree.destDir);
        var isTests = /tests$/.test(destDir);
        var isSelf = type === 'self';
        var isParent = type === 'parent';

        var options = {
          registryType: type,
          moduleName: this._addon.name,
          prefix: isSelf ? ('modules/' + this._addon.name) : registry.app.name,
          baseDir: path.join(this._addon.root, 'addon'),
          scss: ['styles/components/*.scss']
        };

        // TODO need a better way of determining app tree from app tests tree
        switch (true) {
          case isTests  : return tree;
          case isSelf   : return jsPreprocessor(tree, options);
          case isParent : return jsPreprocessor(tree, options);
          default       : return tree;
        }
      }
    });
  },

  setupTemplatePreprocessing: function(registry) {
    registry.add('template', {
      name: 'generate-templates-for-scss',
      _addon: this,
      toTree: function(tree) {
        var options = {
          prefix: path.join('modules/', this._addon.name),
          baseDir: path.join(this._addon.root, 'addon'),
          scss: ['styles/components/*.scss']
        };

        return templatePreprocessor(tree, options);
      }
    });
  },

  setupCssPreprocessing: function(registry) {
    registry.add('css', {
      name: 'mixin-classes',
      toTree: function(tree) {
        return scssPreprocessor(tree, {
          components: 'components/*.scss'
        });
      }
    });
  },

  setupHtmlTransform: function(registry) {
    registry.add('htmlbars-ast-plugin', {
      name: 'transform-component-classes',
      plugin: TransformComponentClasses
    });
  },

  postprocessTree: function(type, tree) {
    if (type === 'css') {
      tree = csso(tree);
    }

    return tree;
  }
});

module.exports = UITheme;
