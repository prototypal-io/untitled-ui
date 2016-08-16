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
  this.themePrefix = options.themePrefix || 'base';
  this.parentTheme = options.parentTheme;
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
  var parentThemeComponentFiles = this.parentTheme ?
    this.parentTheme.toScssComponentFilesArray() : [];

  var themeComponents = importFiles.map(function(filePath) {
    return path.basename(filePath).replace(themePrefix + '--', '').replace('.scss', '');
  });

  var parentThemeComponents = parentThemeComponentFiles.map(function(filePath) {
    return filePath.replace('components\/', '').replace('.scss', '');
  });

  var themeClasses = parentThemeComponents.reduce(function(array, component) {
    if (themeComponents.indexOf(component) === -1) {
      var importStatement = '  &--' + component + ' {\n    @include ' + component + '($theme);\n  }\n';
      array = array.concat(importStatement);
    }

    return array;
  }, []);

  themeClasses = themeComponents.reduce(function(array, component) {
    var importStatement;

    if (themePrefix === 'base') {
      importStatement = '    .' + component + ' {\n      @include ' + component + '($theme);\n    }\n';
    } else {
      importStatement = '  &--' + component + ' {\n    @include ' + themePrefix + '--' + component + '($theme);\n  }\n';
    }

    return array.concat(importStatement);
  }, themeClasses);

  var themeMixin = this.buildThemeMixin(themeClasses);

  return themeMixin;
};

Import.prototype.buildThemeMixin = function(themeClasses) {
  if (this.themePrefix === 'base') {
    return '@mixin ' + this.themeName + '($theme...) {\n' +
      '  $theme: keywords($theme);\n\n' +
      '  @at-root {\n' +
      themeClasses.join('\n') +
      '  }\n' +
    '}';
  } else {
    return '@mixin ' + this.themeName + '($theme...) {\n' +
      '  $theme: keywords($theme);\n\n' +
      themeClasses.join('\n') +
    '}';
  }
};

module.exports = Import;
