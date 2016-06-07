/* jshint node: true */
'use strict';

var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var CachingWriter = require('broccoli-caching-writer');

BroccoliAddImportsMap.prototype = Object.create(CachingWriter.prototype);
BroccoliAddImportsMap.prototype.constructor = BroccoliAddImportsMap;

function BroccoliAddImportsMap(inputNode, options) {
  if (!(this instanceof BroccoliAddImportsMap)) {
    return new BroccoliAddImportsMap(inputNode, options);
  }

  CachingWriter.call(this, [inputNode]);

  this.map = options.map || {};
}

BroccoliAddImportsMap.prototype.build = function() {
  var outputPath = path.join(this.outputPath, 'modules/untitled-ui');
  var filePath = path.join(outputPath, 'imports-map.js');
  var mapString = JSON.stringify(this.map);

  mkdirp.sync(outputPath);
  fs.writeFileSync(filePath, 'export default ' + mapString, 'utf8');
};

module.exports = BroccoliAddImportsMap;
