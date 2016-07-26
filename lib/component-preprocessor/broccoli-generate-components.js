/* jshint node: true */
'use strict';

var path = require('path');

var CachingWriter = require('broccoli-caching-writer');
var walkSync = require('walk-sync');

Generate.prototype = Object.create(CachingWriter.prototype);
Generate.prototype.constructor = Generate;

function Generate(inputTree, options, fileProcessor) {
  CachingWriter.call(this, [inputTree]);

  this.themes = options.themes;
  this.moduleNamespace = options.moduleNamespace;
  this.stylesNamespace = options.stylesNamespace;
  this.componentsNamespace = options.componentsNamespace;
  this.templatesNamespace = options.templatesNamespace;
  this.resolver = options.resolver;
  this.fileProcessor = fileProcessor;
}

Generate.prototype.build = function() {
  var contexts = this.buildContexts();

  Object.keys(contexts).forEach(function(themeName) {
    var context = contexts[themeName];

    context.scss.forEach(function(scssFile) {
      var tuple = this.resolver.baseComponentFor(scssFile, context, contexts);
      if (tuple) {
        this.fileProcessor({
          broccoliInputDir: this.inputPaths[0],
          broccoliOutputDir: this.outputPath,
          themeName: themeName,
          scss: scssFile,
          js: tuple.js,
          hbs: tuple.hbs
        });
      }
    }, this);
  }, this);
};

Generate.prototype.buildContexts = function() {
  var inputPath = this.inputPaths[0];

  return this.themes.reduce(function(hash, theme) {
    var scssGlob = path.join(this.moduleNamespace, theme.name, this.stylesNamespace, this.componentsNamespace, '*.scss');
    var jsGlob = path.join(this.moduleNamespace, theme.name, this.componentsNamespace, '*.js');
    var hbsGlob = path.join(this.moduleNamespace, theme.name, this.templatesNamespace, this.componentsNamespace, '*.hbs');

    var scssComponents = walkSync(inputPath, { globs: [ scssGlob ] });
    var jsComponents = walkSync(inputPath, { globs: [ jsGlob ] });
    var hbsComponents = walkSync(inputPath, { globs: [ hbsGlob ] });

    hash[theme.name] = {
      name: theme.name,
      prefix: theme.prefix,
      parentThemeName: theme.parentTheme && theme.parentTheme.name,
      scss: scssComponents,
      js: jsComponents,
      hbs: hbsComponents
    };

    return hash;
  }.bind(this), {});
};

module.exports = Generate;
