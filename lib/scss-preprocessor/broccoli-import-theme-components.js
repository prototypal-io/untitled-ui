/* jshint node: true */
'use strict';

var path = require('path');

var Filter = require('broccoli-persistent-filter');
var walkSync = require('walk-sync');

function Import(inputTree, options) {
  Filter.call(this, inputTree, options);

  this.include = options.include;
  this.main = options.main;
  this.themeName = options.themeName;
  this.themePrefix = options.themePrefix;
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
  var parentThemePrefix = this.parentTheme && this.parentTheme.prefix;
  var parentThemeComponentFiles = this.parentTheme ?
    this.parentTheme.toScssComponentFilesArray() : [];

  var themeComponents = kindComponentsFor(importFiles, themePrefix);
  var parentThemeComponents = kindComponentsFor(parentThemeComponentFiles, parentThemePrefix);

  var parentComponentsToImport = parentThemeComponents.filter(function(parentThemeComponent) {
    return themeComponents.filter((function(themeComponent) {
      return themeComponent.name === parentThemeComponent.name
    })).length === 0;
  });

  var componentsToImport = [].concat(themeComponents).concat(parentComponentsToImport);

  var themeClasses = componentsToImport.reduce(function(array, component) {
    var className = '&--' + component.name + '--' + component.kind;
    var mixin = component.themePrefix + '--' + component.name + '--' + component.kind;

    var importStatement =
      '  ' + className  + ' {\n' +
      '    @include ' + mixin  + '($theme);\n' +
      '  }\n';

    return array.concat(importStatement);
  }, []);

  var themeMixin = this.buildThemeMixin(themeClasses);

  return themeMixin;
};

Import.prototype.buildThemeMixin = function(themeClasses) {
  return '@mixin ' + this.themeName + '($theme...) {\n' +
    '  $theme: keywords($theme);\n\n' +
    themeClasses.join('\n') +
  '}';
};

function kindComponentsFor(filePaths, themePrefix) {
  var kindComponentRegExp = new RegExp(themePrefix + '--(ui-.+)--(.+).scss');

  return filePaths
    .filter(function(filePath) { return filePath.match(kindComponentRegExp); })
    .map(function(filePath) {
      var componentParts = filePath.match(kindComponentRegExp);

      return {
        name: componentParts[1],
        themePrefix: themePrefix,
        kind: componentParts[2]
      }
    });
}

module.exports = Import;
