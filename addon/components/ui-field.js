import Ember from 'ember';
import layout from '../templates/components/ui-field';

export default Ember.Component.extend({
  layout,
  tagName: '',

  type: 'input',
  kind: 'default',
  size: 'medium',

  generatedInputId: Ember.computed(function() {
    return `${Ember.guidFor(this)}--input`;
  }),

  generatedLabelId: Ember.computed(function() {
    return `${Ember.guidFor(this)}--label`;
  }),

  frame: Ember.computed('kind', function() {
    return `ui-field--${this.get('kind')}`;
  }),

  input: Ember.computed('type', function() {
    return `ui-${this.get('type')}`;
  }),

  classes: Ember.computed('size', function() {
    return {
      size: `ui-font-size--${this.get('size')}`
    }
  }),

  states: Ember.computed('disabled', function() {
    return {
      disabled: this.get('disabled')
    }
  }),
});
