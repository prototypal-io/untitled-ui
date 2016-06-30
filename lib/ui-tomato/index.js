/*jshint node:true*/
var scssPreprocessor = require('../scss-preprocessor');

module.exports = {
  name: 'ui-tomato',

  isDevelopingAddon: function() {
    return true;
  },

  included: function(app, parentAddon) {
    var target = (parentAddon || app);
    target.options = target.options || {};
    target.options.babel = target.options.babel || { includePolyfill: true };
    return this._super.included(target);
  },

  setupPreprocessorRegistry: function(type, registry) {
    if (type === 'self') {
      this.setupCssPreprocessing(registry);
    }
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
  }
};
