import { moduleForComponent, test } from 'ember-qunit';
import getOwner from 'ember-getowner-polyfill';

moduleForComponent('ui-button--base', 'Integration | Component | ui button (base)', {
  integration: true
});

// this test is to assert that the build doesn't auto generate "base"
// kind components, if you create this component manually then you can
// remove this test
test('it doesnt exist', function(assert) {
  var container = getOwner(this);
  var component = container.lookup('component:ui-button--base');

  assert.ok(!component);
});
