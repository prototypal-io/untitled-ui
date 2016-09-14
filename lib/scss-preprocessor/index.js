/* jshint node: true */
'use strict';

var path = require('path');

var funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');

var TransformComponents = require('./broccoli-transform-components');
var ImportThemeComponents = require('./broccoli-import-theme-components');
var ProvideAppImports = require('./broccoli-provide-app-imports');
var ProvideThemeImports = require('./broccoli-provide-theme-imports');

module.exports = function(tree, options) {
  var themes = options.themes || [];
  var componentsNamespace = options.componentsNamespace;
  var scssMainFilePath = 'app/styles/app.scss';

  var themeTrees = themes.reduce(function(trees, theme) {
    var themeTree = theme.toScssTree();
    themeTree = funnel(themeTree, {
      destDir: path.join(theme.name)
    });
    themeTree = new TransformComponents(themeTree, {
      componentsNamespace: componentsNamespace
    });

    var themeMain = path.join(theme.name, theme.name + '.scss');

    themeTree = new ImportThemeComponents(themeTree, {
      main: themeMain,
      themeName: theme.name,
      themePrefix: theme.prefix,
      parentTheme: theme.parentTheme,
      include: [path.join(theme.name, componentsNamespace, '*.scss')]
    });

    var appImport = new ProvideAppImports(themeTree, {
      importPath: themeMain.replace('.scss', ''),
      dest: path.dirname(scssMainFilePath),
      themeName: theme.name
    });

    trees.push(themeTree);
    trees.push(appImport);

    if (theme.parentTheme) {
      var parentMain = themeMain.replace(new RegExp(theme.name, 'g'), theme.parentTheme.name);

      var themeImport = new ProvideThemeImports(themeTree, {
        themeName: theme.name,
        parentThemeName: theme.parentTheme.name,
        main: themeMain,
        parentMain: parentMain
      });

      trees.push(themeImport);
    }

    return trees;
  }, []);

  var scssTree = funnel(tree, { include: ['**/*.scss'] });
  scssTree = mergeTrees([scssTree].concat(themeTrees), { overwrite: true });

  return scssTree;
};
