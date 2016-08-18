/* jshint node: true */
'use strict';

var Filter = require('broccoli-persistent-filter');

function extract(pattern, string) {
  var match = string.match(pattern);
  return match && match[1];
}

function Transform(inputTree, options) {
  Filter.call(this, inputTree, options);

  this.componentsNamespace = options.componentsNamespace;
}

Transform.prototype = Object.create(Filter.prototype);
Transform.prototype.constructor = Transform;
Transform.prototype.extensions = ['scss'];
Transform.prototype.targetExtension = 'scss';

Transform.prototype.processString = function(content, relPath) {
  var name = extract(this.namePattern(), relPath);
  var processed = content;

  if (name) {
    processed = this.replaceWithMixin(processed, name);
    processed = this.replaceThemeVariables(processed);
  }

  return processed;
};

Transform.prototype.namePattern = function() {
  return new RegExp('^.+\/'+this.componentsNamespace+'\/(.+)\.scss$');
};

Transform.prototype.replaceWithMixin = function(content, name) {
  content = content.replace(/@component\(/, '@mixin ' + name + '($theme,');
  content = content.replace(',)', ')');
  return content;
};


// Replaces:
//
// `^theme-variable`
//
// with:
//
// `map-get($theme, "theme-variable")`

Transform.prototype.replaceThemeVariables = function(content) {
  return content.replace(/\^([\w|-]+)(,|;|\)|\s)/gi, 'map-get($theme, "$1")$2');
}

module.exports = Transform;
