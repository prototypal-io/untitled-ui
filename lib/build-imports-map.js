/* jshint node:true */
'use strict';

// TODO have this build the map based on the scss import
// dependency map instead of the styles directory structure

var path = require('path');
var walkSync = require('walk-sync');

module.exports = function(projectRoot, options) {
  options = options || {};

  var scssRoot = path.join(projectRoot, 'addon/styles');
  var include = options.include || ['**/*.scss'];
  var ignored = options.ignore  || [];

  var files = workingFiles(scssRoot, include, ignored);

  return buildMap(files, options.debug);
};

var workingFiles = function(scssRoot, include, ignored) {
  var includeFiles = walkSync(scssRoot, { globs: include });
  var ignoredFiles = walkSync(scssRoot, { globs: ignored });

  return includeFiles.filter(function(file) {
    return ignoredFiles.indexOf(file) === -1;
  });
};

var buildMap = function(files, debug) {
  return files.reduce(function(manifest, file) {
    var key = file;
    var prefix;

    if (debug) {
      prefix = key.replace('.css', '').replace(/\//g, '-');
    } else {
      prefix = generateUniquePrefix(manifest);
    }

    manifest[key] = prefix;

    return manifest;
  }, {});
};

var generateUniquePrefix = function(manifest, isCopy, prevClass) {
  var mut, next, currentKey, currentClass;
  var prefix = '_u';

  if (isCopy) {
    mut = manifest;
  } else {
    mut = JSON.parse(JSON.stringify(manifest));
  }

  // null case
  if (Object.keys(mut).length === 0 && !prevClass) {
    return prefix + '0';
  }

  // base case
  if (Object.keys(mut).length === 0 && prevClass) {
    next = Number(prevClass.slice(prefix.length)) + 1;

    return prefix + next;
  }

  // recurse
  currentKey = Object.keys(mut)[0];
  currentClass = mut[currentKey];
  delete mut[currentKey];

  return generateUniquePrefix(mut, true, currentClass);
};
