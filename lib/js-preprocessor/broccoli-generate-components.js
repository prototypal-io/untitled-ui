/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');

var CachingWriter = require('broccoli-caching-writer');
var walkSync = require('walk-sync');
var existsSync = require('exists-sync');
var mkdirp = require('mkdirp');

GenerateComponents.prototype = Object.create(CachingWriter.prototype);
GenerateComponents.prototype.constructor = GenerateComponents;

function GenerateComponents(inputTree, options) {
  CachingWriter.call(this, [inputTree]);

  this.registryType = options.registryType;
  this.moduleName = options.moduleName;
  this.prefix = options.prefix;
  this.baseDir = options.baseDir;
  this.scss = options.scss;
}

GenerateComponents.prototype.build = function() {
  var components = componentsToGenerate(this.baseDir, this.scss, this.moduleName);

  components.forEach(function(hash) {
    this.generateFile(hash.component, hash.default);
  }, this);
};

GenerateComponents.prototype.generateFile = function(fileName, defaultFile) {
  var component;
  if (this.registryType === 'self') {
    component = this.addonComponentFor(fileName, defaultFile);
  } else {
    component = this.appComponentFor(fileName);
  }

  var outputFile = path.join(this.outputPath, this.prefix, fileName);
  var outputDir = path.dirname(outputFile);

  mkdirp.sync(outputDir);
  fs.writeFileSync(outputFile, component, 'utf8');
};

GenerateComponents.prototype.addonComponentFor = function(fileName, defaultFile) {
  var defaultModule = defaultFile.replace(/(.+)\.js$/, this.moduleName + '/$1');
  var layout = fileName.replace(/(.+)\.js$/, this.moduleName + '/templates/$1');

  return "import DefaultComponent from '" + defaultModule + "';\n" +
         "import layout from '" + layout + "';\n\n" +
         "export default DefaultComponent.extend({ layout });\n";
};

GenerateComponents.prototype.appComponentFor = function(fileName) {
  var defaultModule = fileName.replace(/(.+)\.js$/, this.moduleName + '/$1');

  return "export { default } from '" + defaultModule + "';\n";
};

var componentsToGenerate = function(baseDir, scss, moduleName) {
  var scssFiles = walkSync(baseDir, { globs: scss });
  var baseKindFile = path.join(moduleName, 'components', 'ui-kind');

  var expectedJsFiles = scssFiles.map(function(fileName) {
    return fileName.replace(/^styles\/components\/(.+)\.scss/, 'components/$1.js');
  });

  var missingComponents = expectedJsFiles.filter(function(fileName) {
    var isBaseKind = /.+--base\.js$/.test(fileName);
    var doesExist = existsSync(path.join(baseDir, fileName));

    return !isBaseKind && !doesExist;
  });

  var components = [];
  missingComponents.forEach(function(fileName) {
    var defaultKindFile = fileName.replace(/(.+)--(.+)\.js$/, '$1--default.js');
    var defaultFileExists = existsSync(path.join(baseDir, defaultKindFile));
    var defaultFile = defaultFileExists ? defaultKindFile : baseKindFile;

    components.push({
      component: fileName,
      default: defaultFile
    });
  }, this);

  return components;
};

module.exports = GenerateComponents;
