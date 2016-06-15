import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui-button--primary', 'Integration | Component | ui button  primary', {
  integration: true
});

test('it renders the correctly prefixed class names', function(assert) {
  this.set('classes', { size: 'ui-font-size-md' });
  this.set('states', { active: true });

  this.render(hbs`
    {{#ui-button kind="primary" classes=classes states=states}}
      foo
    {{/ui-button}}
  `);

  assert.equal(this.$('.ui-font-size-md').length, 1, 'didnt transform font-size class');
  assert.equal(this.$('.ui-button--primary').length, 1, 'transformed main component class');
  assert.equal(this.$('.ui-button--primary--active').length, 1, 'transformed mustache statement');
  assert.equal(this.$('div.ui-button--primary--wrapper').length, 1, 'transformed child element class');
});
