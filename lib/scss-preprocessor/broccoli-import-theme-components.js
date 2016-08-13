/* jshint node: true */
'use strict';

var path = require('path');

var Filter = require('broccoli-persistent-filter');
var walkSync = require('walk-sync');

function Import(inputTree, options) {
  Filter.call(this, inputTree, options);

  this.include = options.include;
  this.main = options.main;
  this.themeName = options.themeName || 'ui-base';
  this.themePrefix = options.themePrefix || 'ui-base';
}

Import.prototype = Object.create(Filter.prototype);
Import.prototype.constructor = Import;
Import.prototype.extensions = ['scss'];
Import.prototype.targetExtension = 'scss';

Import.prototype.processString = function(content, relPath) {
  if (relPath === this.main) {
    var imports = this.addImports(content);
    var themeMixin = this.addThemeComponentClasses(content);

    return imports + '\n' + themeMixin;
  } else {
    return content;
  }
};

Import.prototype.addImports = function(content) {
  var inputPath = this.inputPaths[0];
  var mainPath = this.main;
  var mainDir = path.dirname(mainPath);
  var importFiles = walkSync(inputPath, { globs: this.include });

  var importsString = importFiles.reduce(function(string, filePath) {
    var fileDir = path.dirname(filePath);
    var relDir = path.relative(mainDir, fileDir);
    var name = path.basename(filePath).replace('.scss', '');
    var importPath = './' + relDir + '/' + name;

    return string += '@import "' + importPath + '";\n';
  }, '\n');

  return content + importsString;
};

Import.prototype.addThemeComponentClasses = function(content) {
  var inputPath = this.inputPaths[0];
  var importFiles = walkSync(inputPath, { globs: this.include });
  var themePrefix = this.themePrefix;

  var componentClasses = importFiles.reduce(function(string, filePath) {
    var name = path.basename(filePath).replace(themePrefix + '--', '').replace('.scss', '');

    return string += '  &--' + name + ' {\n    @include ' + name + '($theme);\n  }\n\n';
  }, '');

  var themeMixin = '@mixin ' + this.themeName + '($theme...) {\n' +
    '  $theme: keywords($theme);\n\n' +
    componentClasses +
  '}';

  return themeMixin;
};

module.exports = Import;
