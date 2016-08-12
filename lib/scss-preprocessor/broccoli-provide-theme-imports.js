/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');

var CachingWriter = require('broccoli-caching-writer');
var walkSync = require('walk-sync');
var mkdirp = require('mkdirp');

Provide.prototype = Object.create(CachingWriter.prototype);
Provide.prototype.constructor = Provide;

function Provide(inputTree, options) {
  CachingWriter.call(this, [inputTree]);

  this.themeName = options.themeName;
  this.parentThemeName = options.parentThemeName;
  this.main = options.main;
  this.parentMain = options.parentMain;
}

Provide.prototype.build = function() {
  var main = path.join(this.outputPath, this.main);
  var replace = new RegExp(this.themeName + '.scss$');
  var outFile = main.replace(replace, this.parentThemeName + '.scss');
  var outDir = path.dirname(outFile);

  mkdirp.sync(outDir);

  var importPath = path.join(this.outputPath, this.parentMain).replace('.scss', '');
  var relImportPath = path.relative(outDir, importPath);
  var content = "@import '"+relImportPath+"';\n";

  fs.writeFileSync(outFile, content, 'utf8');
};

module.exports = Provide;
