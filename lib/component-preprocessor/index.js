/* jshint node: true */
'use strict';

var path = require('path');

var GenerateComponents = require('./broccoli-generate-components');
var mergeTrees = require('broccoli-merge-trees');
var funnel = require('broccoli-funnel');

module.exports = function(options, processor) {
  var themeTrees = mergeTrees(options.themes.reduce(function(trees, theme) {
    var themeScssTree = theme.toScssTree();
    var themeJsTree = theme.toJsTree();
    var themeHbsTree = theme.toHbsTree();

    themeScssTree = funnel(themeScssTree, {
      destDir: path.join(options.moduleNamespace, theme.name, options.stylesNamespace)
    });

    themeJsTree = funnel(themeJsTree, {
      destDir: path.join(options.moduleNamespace, theme.name)
    });

    themeHbsTree = funnel(themeHbsTree, {
      destDir: path.join(options.moduleNamespace, theme.name, options.templatesNamespace)
    });

    trees.push(themeScssTree);
    trees.push(themeJsTree);
    trees.push(themeHbsTree);

    return trees;
  }, []));

  return new GenerateComponents(themeTrees, options, processor);
};


