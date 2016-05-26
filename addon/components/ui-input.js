import Ember from 'ember';
import layout from '../templates/components/ui-input';

export default Ember.Component.extend({
  layout,

  tagName: '',
  kind: 'default',
  disabled: false,
  error: false,

  frame: Ember.computed('kind', function() {
    return `ui-input--${this.get('kind')}`;
  }),

  classes: Ember.computed('kind', 'size', 'error', 'disabled', function() {
    return {
      parent: 'ui-input',
      size: `ui-font-size--${this.get('size')}`
    }
  }),

  states: Ember.computed('disabled', 'error', function() {
    return {
      disabled: this.get('disabled'),
      error: this.get('error')
    }
  }),
});
