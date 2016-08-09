/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');

var mkdirp = require('mkdirp');
var mergeTrees = require('broccoli-merge-trees');
var funnel = require('broccoli-funnel');
var componentPreprocessor = require('./index');

module.exports = function(tree, themeName, _options) {
  var options = _options || {};
  var themes = options.themes;
  var workingTree = tree;

  options.resolveType = 'js';

  // for some reason the theme tests get
  // pulled into this tree. remove them
  themes.forEach(function(theme) {
    workingTree = funnel(workingTree, {
      exclude: [ new RegExp(theme.name + '\/tests\/') ]
    });
  });

  var generatedComponents = componentPreprocessor(options, function(fileOptions) {
    if (fileOptions.themeName !== themeName) { return; }

    var baseName = path.basename(fileOptions.scss).replace(/\.scss$/, '.js');
    var fileName = path.join(options.moduleNamespace, fileOptions.themeName, options.componentsNamespace, baseName);
    var importFrom = fileOptions.importSrc.replace(options.moduleNamespace + '/', '').replace(/\.js/, '');
    var templateBaseName = baseName.replace(/\.js$/, '');
    var templateImportFrom = path.join(fileOptions.themeName, options.templatesNamespace, options.componentsNamespace, templateBaseName);

    var content = "import BaseComponent from '" + importFrom + "';\n" +
                  "import layout from '" + templateImportFrom + "';\n\n" +
                  "export default BaseComponent.extend({ layout });\n";

    var outputFile = path.join(fileOptions.broccoliOutputDir, fileName);
    var outputDir = path.dirname(outputFile);

    mkdirp.sync(outputDir);
    fs.writeFileSync(outputFile, content, 'utf8');
  });

  workingTree = mergeTrees([workingTree, generatedComponents]);
  return funnel(workingTree, { exclude: ['**/*.scss'] });
}
