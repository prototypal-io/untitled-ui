/* jshint node: true */
'use strict';

var Filter = require('broccoli-persistent-filter');

var COMPONENT_CLASS_PATTERN = /^components\/(.+)\.scss/;

function MixinClasses (inputTree) {
  Filter.call(this, inputTree);
}

MixinClasses.prototype = Object.create(Filter.prototype);
MixinClasses.prototype.constructor = MixinClasses;
MixinClasses.prototype.extensions = ['scss'];
MixinClasses.prototype.targetExtension = 'scss';

MixinClasses.prototype.processString = function(content, relPath) {
  if (!COMPONENT_CLASS_PATTERN.test(relPath)) return content;

  var className = classNameFor(relPath);
  return appendMixinClass(content, className);
}

var classNameFor = function(relPath) {
  return relPath.match(COMPONENT_CLASS_PATTERN)[1];
};

var appendMixinClass = function(content, className) {
  return content + '\n\n' +
         '.' + className + '{\n' +
         '  @include ' + className + '();\n' +
         '}\n';
};

module.exports = MixinClasses;
