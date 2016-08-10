/* jshint node: true */
'use strict';

var path = require('path');

var mergeTrees = require('broccoli-merge-trees');
var funnel = require('broccoli-funnel');
var componentPreprocessor = require('./index');
var mkdirp = require('mkdirp');
var symlinkOrCopySync = require('symlink-or-copy').sync;

module.exports = function(tree, themeName, _options) {
  var options = _options || {};
  var themes = options.themes;
  var workingTree = tree;

  options.resolveType = 'hbs';

  var generatedComponents = componentPreprocessor(options, function(fileOptions) {
    if (fileOptions.themeName !== themeName) { return; }

    var srcRelPath = fileOptions.importSrc;
    var src = path.join(fileOptions.broccoliInputDir, srcRelPath);

    var targetRelPath = fileOptions.scss;

    targetRelPath = targetRelPath.replace(options.stylesNamespace, options.templatesNamespace);
    targetRelPath = targetRelPath.replace(/\.scss$/, '.hbs');

    var target = path.join(fileOptions.broccoliOutputDir, targetRelPath);
    var targetDir = path.dirname(target);

    mkdirp.sync(targetDir);
    symlinkOrCopySync(src, target);
  });

  workingTree = mergeTrees([workingTree, generatedComponents]);
  return funnel(workingTree, { exclude: ['**/*.scss', '**/*.js'] });
}
