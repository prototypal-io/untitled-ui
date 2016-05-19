import Ember from 'ember';
import layout from '../templates/components/ui-field';

export default Ember.Component.extend({
  layout,
  tagName: '',

  type: 'ui-input',

  kind: 'default',
  size: 'medium',

  generatedInputId: Ember.computed(function() {
    return `${Ember.guidFor(this)}__input`;
  }),

  generatedLabelId: Ember.computed(function() {
    return `${Ember.guidFor(this)}__label`;
  }),

  frame: Ember.computed('kind', function() {
    return `ui-field--${this.get('kind')}`;
  }),

  classes: Ember.computed('size', function() {
    return {
      parent: 'ui-field',
      size: `ui-font-size--${this.get('size')}`
    }
  }),

  states: Ember.computed('disabled', function() {
    return {
      disabled: this.get('disabled')
    }
  }),
});
