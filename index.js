/* jshint node: true */
'use strict';

var csso = require('broccoli-csso');

module.exports = {
  name: 'untitled-ui',

  postprocessTree: function(type, tree) {
    return type === 'css' ? csso(tree) : tree;
  },

  isDevelopingAddon: function() {
    return true;
  }
};
