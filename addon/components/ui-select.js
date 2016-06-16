import Ember from 'ember';
import layout from '../templates/components/ui-select';

export default Ember.Component.extend({
  layout,
  tagName: '',

  kind: 'default',
  disabled: false,
  error: false,

  frame: Ember.computed('kind', function() {
    return `ui-select--${this.get('kind')}`;
  }),

  classes: Ember.computed('class', 'size', function() {
    return {
      class: this.get('class'),
      size: `ui-font-size--${this.get('size')}`
    };
  }),

  states: Ember.computed('disabled', 'error', function() {
    return {
      disabled: this.get('disabled'),
      error: this.get('error')
    }
  })
});
