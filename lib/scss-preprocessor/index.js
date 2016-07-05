/* jshint node: true */
'use strict';

var funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

var WriteMixins = require('./broccoli-component-mixins');
var WriteComponentImports = require('./broccoli-auto-import-components');

module.exports = function(tree, options) {
  var components = options.components;

  var componentScssTree = new WriteMixins(funnel(tree, {
    include: [ components ]
  }));

  var addonScssTree = new WriteComponentImports(tree, {
    main: options.name + '.scss',
    components: components
  });

  return mergeTrees([tree, componentScssTree, addonScssTree], { overwrite: true });
};
