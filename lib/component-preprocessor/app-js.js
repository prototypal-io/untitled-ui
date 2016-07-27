/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');

var mkdirp = require('mkdirp');
var mergeTrees = require('broccoli-merge-trees');
var funnel = require('broccoli-funnel');
var componentPreprocessor = require('./index');

module.exports = function(tree, options) {
  var themes = options.themes;
  var workingTree = tree;

  // for some reason the theme tests get
  // pulled into this tree. remove them
  themes.forEach(function(theme) {
    workingTree = funnel(workingTree, {
      exclude: [ new RegExp(theme.name + '\/tests\/') ]
    });
  });

  var generatedComponents = componentPreprocessor(options, function(fileOptions) {
    var baseName = path.basename(fileOptions.scss).replace(/\.scss$/, '');
    var fileName = path.join(options.appName, options.componentsNamespace, baseName + '.js');
    var exportFrom = path.join(fileOptions.themeName, options.componentsNamespace, baseName);
    var content = "export { default } from '" + exportFrom + "';\n";

    var outputFile = path.join(fileOptions.broccoliOutputDir, fileName);
    var outputDir = path.dirname(outputFile);

    mkdirp.sync(outputDir);
    fs.writeFileSync(outputFile, content, 'utf8');
  });

  workingTree = mergeTrees([workingTree, generatedComponents]);
  return funnel(workingTree, { exclude: ['**/*.scss'] });
}
