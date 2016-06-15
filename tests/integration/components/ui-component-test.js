import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import UIComponent from 'untitled-ui/components/ui-component';
import UIKind from 'untitled-ui/components/ui-kind';

const UICarComponent = UIComponent.extend();
const UICarDefaultComponent = UIKind.extend();
const UICarTeslaComponent = UIKind.extend();

moduleForComponent('ui-component', 'Integration | Component | ui component', {
  integration: true,

  beforeEach() {
    this.register('component:ui-car', UICarComponent);
    this.register('component:ui-car--default', UICarDefaultComponent);
    this.register('component:ui-car--tesla', UICarTeslaComponent);
  }
});

test('it is tagless', function(assert) {
  this.render(hbs`{{ui-car}}`);
  assert.equal(this.$('.ember-view').length, 0, 'no wrapper element found');
});

test('it renders the default kind component', function(assert) {
  this.render(hbs`{{ui-car}}`);
  assert.equal(this.$('.ui-car--default').length, 1, 'default component rendered');
});

test('it renders the specified kind component', function(assert) {
  this.render(hbs`{{ui-car kind="tesla"}}`);

  assert.equal(this.$('.ui-car--tesla').length, 1, 'given kind is rendered');
});
