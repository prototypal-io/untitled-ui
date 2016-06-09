/* jshint node: true */
'use strict';

var preprocessScss = require('./lib/scss-preprocessor');
var TransformComponentClasses = require('./lib/transform-component-classes');

module.exports = {
  name: 'untitled-ui',

  included: function(app) {
    this._super.included(app);

    app.import('vendor/normalize.css');
  },

  setupPreprocessorRegistry: function(type, registry) {
    if (type !== 'self') return;

    registry.add('css', {
      name: 'mixin-classes',
      toTree: function(tree) {
        return preprocessScss(tree);
      }
    })

    registry.add('htmlbars-ast-plugin', {
      name: 'transform-component-classes',
      plugin: TransformComponentClasses
    });
  }
};
