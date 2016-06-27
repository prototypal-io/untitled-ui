import { uiComponentClass } from 'dummy/helpers/-ui-component-class';
import { module, test } from 'qunit';

module('Unit | Helper | -ui component class');

test('it returns original classes when no prefix is given', function(assert) {
  let result = uiComponentClass(['hello', 'world']);

  assert.equal(result, 'hello world ');
});

test('it returns removes :component when no prefix is given', function(assert) {
  let result = uiComponentClass([':component', 'hello', 'world']);

  assert.equal(result, 'hello world ');
});

test('it prefixes classes with given prefix', function(assert) {
  let classes =['hello', 'world'];
  let options = { prefix: 'ui-foo' };

  let result = uiComponentClass(classes, options);

  assert.equal(result, 'ui-foo--hello ui-foo--world ');
});

test('it replaces ":component" with prefix', function(assert) {
  let classes =[':component'];
  let options = { prefix: 'ui-foo--default' };

  let result = uiComponentClass(classes, options);

  assert.equal(result, 'ui-foo--default ');
});

test('it does not prefix font size classes', function(assert) {
  let classes =['ui-font-size--medium'];
  let options = { prefix: 'ui-foo' };

  let result = uiComponentClass(classes, options);

  assert.equal(result, 'ui-font-size--medium ');
});

test('it does not font awesome classes', function(assert) {
  let classes =['fa', 'fa-pencil'];
  let options = { prefix: 'ui-foo' };

  let result = uiComponentClass(classes, options);

  assert.equal(result, 'fa fa-pencil ');
});
