/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');

var CachingWriter = require('broccoli-caching-writer');
var walkSync = require('walk-sync');
var mkdirp = require('mkdirp');

ComponentImports.prototype = Object.create(CachingWriter.prototype);
ComponentImports.prototype.constructor = ComponentImports;

function ComponentImports(inputTree, options) {
  CachingWriter.call(this, [inputTree]);

  this.main = options.main;
  this.components = options.components;
}

ComponentImports.prototype.build = function() {
  var inputPath = this.inputPaths[0];
  var mainPath = this.main;
  var mainDir = path.dirname(mainPath);
  var componentFiles = walkSync(inputPath, { globs: [ this.components ] });

  var importsString = componentFiles.reduce(function(string, filePath) {
    var fileDir = path.dirname(filePath);
    var relDir = path.relative(mainDir, fileDir);
    var name = path.basename(filePath).replace('.scss', '');
    var importPath = './' + relDir + '/' + name;

    return string += '@import "' + importPath + '";\n';
  }, '\n');

  var mainFile = path.join(inputPath, mainPath);
  var mainContent = fs.readFileSync(mainFile, 'utf8');
  var output = mainContent + importsString;

  var outputFile = path.join(this.outputPath, this.main);
  var outputDir = path.dirname(outputFile);

  mkdirp.sync(outputDir);
  fs.writeFileSync(outputFile, output, 'utf8');
};

module.exports = ComponentImports;
