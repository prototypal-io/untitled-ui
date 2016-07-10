/* jshint node: true */
'use strict';

var path = require('path');

var funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

var TransformComponents = require('./broccoli-transform-components');
var ImportThemeComponents = require('./broccoli-import-theme-components');
var ProvideAppImports = require('./broccoli-provide-app-imports');

module.exports = function(tree, options) {
  var themes = options.themes || [];
  var moduleNamespace = options.moduleNamespace;
  var stylesNamespace = options.stylesNamespace;
  var componentsNamespace = options.componentsNamespace;
  var scssMainFilePath = 'app/styles/app.scss';

  var themeTrees = themes.reduce(function(trees, theme) {
    var themeTree = theme.toScssTree();
    themeTree = funnel(themeTree, {
      destDir: path.join(moduleNamespace, theme.name, stylesNamespace)
    });
    themeTree = new TransformComponents(themeTree, {
      moduleNamespace: moduleNamespace,
      stylesNamespace: stylesNamespace,
      componentsNamespace: componentsNamespace
    });

    var themeMain = path.join(moduleNamespace, theme.name, stylesNamespace, theme.name + '.scss');
    themeTree = new ImportThemeComponents(themeTree, {
      main: themeMain,
      include: [path.join(moduleNamespace, theme.name, stylesNamespace, componentsNamespace, '*.scss')]
    });

    var appImport = new ProvideAppImports(themeTree, {
      importPath: themeMain.replace('.scss', ''),
      dest: path.dirname(scssMainFilePath),
      themeName: theme.name
    });

    trees.push(themeTree);
    trees.push(appImport);

    return trees;
  }, []);

  var scssTree = funnel(tree, { include: ['**/*.scss'] });
  scssTree = mergeTrees([scssTree].concat(themeTrees));
  return scssTree;
};
