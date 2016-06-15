import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import getOwner from 'ember-getowner-polyfill';

const { get } = Ember;

moduleForComponent('ui-button--simple', 'Integration | Component | ui button (simple)', {
  integration: true
});

// this test is to assert that the build auto generates this component
// if you create this component manually, you can remove this test
test('it is the same as the default component except the layout is a copy', function(assert) {
  var container = getOwner(this);

  var defaultComponent = container.lookup('component:ui-button--default');
  var component = container.lookup('component:ui-button--simple');

  var defaultLayout = get(defaultComponent, 'layout');
  var layout = get(component, 'layout');

  var defaultStatements = get(defaultLayout, 'raw.statements');
  var statements = get(layout, 'raw.statements');

  assert.equal(get(layout, 'meta.moduleName'), 'modules/untitled-ui/templates/components/ui-button--simple.hbs', 'correct layout import');
  assert.notEqual(get(defaultLayout, 'meta.moduleName'), get(layout, 'meta.moduleName'), 'different layout import than default component');
  assert.equal(defaultStatements.length, statements.length, 'same top level statements length');

  defaultStatements.forEach(function(statement, index) {
    assert.equal(statement[0], statements[index][0], `statement ${index} is the same`);
  });
});
