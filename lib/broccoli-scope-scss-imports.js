/* jslint node: true */
'use strict';

var Filter = require('broccoli-persistent-filter');
var parser = require('scss-parser');

BroccoliScopeScssImports.prototype = Object.create(Filter.prototype);
BroccoliScopeScssImports.prototype.constructor = BroccoliScopeScssImports;

function BroccoliScopeScssImports(inputNode, options) {
  if (!(this instanceof BroccoliScopeScssImports)) {
    return new BroccoliScopeScssImports(inputNode, options);
  }

  Filter.call(this, inputNode);

  this.map = options.map;
}

BroccoliScopeScssImports.prototype.extensions = ['scss'];
BroccoliScopeScssImports.prototype.targetExtension = 'scss';

BroccoliScopeScssImports.prototype.processString = function(content, relPath) {
  var prefix = this.map && this.map[relPath];

  return prefix ? processScss(content, prefix) : content;
};

var processScss = function(content, prefix) {
  var ast = parser.parse(content);

  // method 1
  // var createQueryWrapper = require('query-ast');
  // var $ = createQueryWrapper(ast);
  // $('class').nodes.forEach(function(nodeWrapper) {
  //   nodeWrapper.node.value.forEach(function(value) {
  //     value = prefix + value;
  //   });
  // });
  // var scss = parser.stringify($().get(0));

  // method 2
  // walkClasses(ast, function(node) {
  //   node.value[0].value = prefix + node.value[0].value;
  // });

  var scss = parser.stringify(ast);
  return scss;
};

var walkClasses = function(node, callback) {
  var util = require('util');

  if (node.type === 'class') {
    callback(node);
  }

  if (util.isArray(node.value)) {
    node.value.forEach(function(childNode) {
      walkClasses(childNode, callback);
    });
  }
}

module.exports = BroccoliScopeScssImports;
