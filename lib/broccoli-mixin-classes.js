/* jshint node: true */
'use strict';

var Filter = require('broccoli-persistent-filter');

function MixinClasses (inputTree) {
  Filter.call(this, inputTree);
}

MixinClasses.prototype = Object.create(Filter.prototype);
MixinClasses.prototype.constructor = MixinClasses;
MixinClasses.prototype.extensions = ['scss'];
MixinClasses.prototype.targetExtension = 'scss';

MixinClasses.prototype.processString = function(content, relPath) {
  var className = classNameFor(relPath);
  return appendMixinClass(content, className);
}

var classNameFor = function(relPath) {
  return relPath.match(/^components\/(.+)\.scss/)[1];
};

var appendMixinClass = function(content, className) {
  return content + '\n\n' +
         '.' + className + '{\n' +
         '  @include ' + className + '();\n' +
         '}\n';
};

module.exports = MixinClasses;
