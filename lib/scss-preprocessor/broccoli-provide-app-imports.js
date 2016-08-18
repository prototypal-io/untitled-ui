/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');

var CachingWriter = require('broccoli-caching-writer');
var walkSync = require('walk-sync');
var existsSync = require('exists-sync');
var mkdirp = require('mkdirp');

Provide.prototype = Object.create(CachingWriter.prototype);
Provide.prototype.constructor = Provide;

function Provide(inputTree, options) {
  CachingWriter.call(this, [inputTree]);

  this.importPath = options.importPath;
  this.dest = options.dest;
  this.themeName = options.themeName;
}

Provide.prototype.build = function() {
  var srcFile = path.join(this.inputPaths[0], this.importPath + '.scss');
  if (!existsSync(srcFile)) {
    throw new Error('themes must implement main scss files');
  }

  this.addAppImports();
};

Provide.prototype.addAppImports = function() {
  var outFile = path.join(this.outputPath, this.dest, this.themeName + '.scss');
  var outDir = path.dirname(outFile);

  mkdirp.sync(outDir);

  var importPath = path.join(this.outputPath, this.importPath);
  var relImportPath = path.relative(outDir, importPath);
  var content = "@import '"+relImportPath+"';\n";

  fs.writeFileSync(outFile, content, 'utf8');
};

module.exports = Provide;
