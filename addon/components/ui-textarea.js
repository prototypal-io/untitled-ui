import Ember from 'ember';
import layout from '../templates/components/ui-textarea';

export default Ember.Component.extend({
  layout,

  tagName: '',
  kind: 'default',
  disabled: false,
  error: false,

  frame: Ember.computed('kind', function() {
    return `ui-textarea--${this.get('kind')}`;
  }),

  classes: Ember.computed('size', function() {
    return {
      parent: 'ui-textarea',
      size: `ui-font-size--${this.get('size')}`
    }
  }),

  states: Ember.computed('disabled', 'states', function() {
    return {
      disabled: this.get('disabled')
    };
  })
});
