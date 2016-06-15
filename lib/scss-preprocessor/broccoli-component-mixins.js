/* jshint node: true */
'use strict';

var Filter = require('broccoli-persistent-filter');

function ComponentMixins (inputTree) {
  Filter.call(this, inputTree);
}

ComponentMixins.prototype = Object.create(Filter.prototype);
ComponentMixins.prototype.constructor = ComponentMixins;
ComponentMixins.prototype.extensions = ['scss'];
ComponentMixins.prototype.targetExtension = 'scss';

ComponentMixins.prototype.processString = function(content, relPath) {
  var name = componentName(relPath);
  var processedContent = content;

  processedContent = replaceWithMixin(processedContent, name);
  processedContent = appendMixinClass(processedContent, name);

  return processedContent;
}

var componentName = function(relPath) {
  return relPath.match(/^components\/(.+)\.scss/)[1];
};

var replaceWithMixin = function(content, name) {
  return content.replace(/@component/, '@mixin ' + name);
};

var appendMixinClass = function(content, name) {
  return content + '\n' +
         '.' + name + '{\n' +
         '  @include ' + name + '();\n' +
         '}\n';
};

module.exports = ComponentMixins;
