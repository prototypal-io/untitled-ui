/* jshint node: true */
'use strict';

var path = require('path');

var CachingWriter = require('broccoli-caching-writer');
var walkSync = require('walk-sync');
var existsSync = require('exists-sync');
var mkdirp = require('mkdirp');
var symlinkOrCopySync = require('symlink-or-copy').sync;

GenerateTemplates.prototype = Object.create(CachingWriter.prototype);
GenerateTemplates.prototype.constructor = GenerateTemplates;

function GenerateTemplates(inputTree, options) {
  CachingWriter.call(this, [inputTree]);

  this.prefix = options.prefix;
  this.baseDir = options.baseDir;
  this.scss = options.scss;
}

GenerateTemplates.prototype.build = function() {
  var inputPath = this.inputPaths[0];
  var outputPath = this.outputPath;
  var templates = templatesToGenerate(this.baseDir, this.scss);

  templates.forEach(function(hash) {
    var srcFile = path.join(inputPath, this.prefix, hash.src);
    var destFile = path.join(outputPath, this.prefix, hash.dest);
    var outputDir = path.dirname(destFile);

    mkdirp.sync(outputDir);
    symlinkOrCopySync(srcFile, destFile);
  }, this);
};

var templatesToGenerate = function(baseDir, scss) {
  var scssFiles = walkSync(baseDir, { globs: scss });

  var expectedTemplates = scssFiles.map(function(fileName) {
    return fileName.replace(/^styles\/components\/(.+)\.scss/, 'templates/components/$1.hbs');
  });

  var missingTemplates = expectedTemplates.filter(function(fileName) {
    var isBaseKind = /.+--base\.hbs$/.test(fileName);
    var doesExist = existsSync(path.join(baseDir, fileName));

    return !isBaseKind && !doesExist;
  });

  var templates = [];
  missingTemplates.forEach(function(fileName) {
    var defaultTemplate = fileName.replace(/(.+)--(.+)\.hbs$/, '$1--default.hbs');
    var defaultTemplateExists = existsSync(path.join(baseDir, defaultTemplate));

    if (defaultTemplateExists) {
      templates.push({
        src: defaultTemplate,
        dest: fileName
      });
    }
  }, this);

  return templates;
};

module.exports = GenerateTemplates;
