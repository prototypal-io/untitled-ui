var path = require('path');

var testrunner = require('qunit');
var walkSync = require('walk-sync');

var units = path.join(__dirname, 'unit');
walkSync(units, { globs: ['**/*-test.js'] }).forEach(function(file) {
  var code = path.join(__dirname, '..', file.replace(/-test\.js$/, '.js'));
  var test = path.join(__dirname, 'unit', file);

  testrunner.run({
    code: code,
    tests: test
  }, function(error/*, report */) {
    if (error)  { throw error; }
  });
});
