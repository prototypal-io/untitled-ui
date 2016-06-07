import Ember from 'ember';
import layout from '../templates/components/ui-checkbox';

export default Ember.Component.extend({
  layout,
  tagName: '',

  kind: 'default',
  disabled: false,
  error: false,
  value: false,

  frame: Ember.computed('kind', function() {
    return `ui-checkbox--${this.get('kind')}`;
  }),

  classes: Ember.computed('size', function() {
    return {
      size: `ui-font-size--${this.get('size')}`,
      class: this.get('class')
    }
  }),

  states: Ember.computed('disabled', 'error', 'value', function() {
    return {
      disabled: this.get('disabled'),
      error: this.get('error'),
      checked: this.get('value')
    }
  })
});
