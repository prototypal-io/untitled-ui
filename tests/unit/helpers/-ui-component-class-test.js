import { uiComponentClass } from 'dummy/helpers/-ui-component-class';
import { module, test } from 'qunit';

module('Unit | Helper | ui component class');

test('it uses the prefix without dashes for :component', function(assert) {
  let result = uiComponentClass(['foo-component--', ':component']);
  assert.equal(result, 'foo-component');
});
