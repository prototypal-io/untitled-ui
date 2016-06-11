/* jshint node: true */
'use strict';

var GenerateComponents = require('./broccoli-generate-components');
var mergeTrees = require('broccoli-merge-trees');
var funnel = require('broccoli-funnel');

module.exports = function(tree, options) {
  var generated = new GenerateComponents(tree, options);

  var merged = mergeTrees([tree, generated]);
  return funnel(merged, { exclude: ['**/*.scss'] });
};


