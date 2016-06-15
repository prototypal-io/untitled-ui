/* jshint node: true */
'use strict';

var GenerateTemplates = require('./broccoli-generate-templates');
var mergeTrees = require('broccoli-merge-trees');

module.exports = function(tree, options) {
  var generated = new GenerateTemplates(tree, options);
  return mergeTrees([tree, generated]);
};
