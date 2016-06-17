import Ember from 'ember';
import UIComponent from './ui-component';
import layout from '../templates/components/ui-field';

export default UIComponent.extend({
  layout,

  type: 'input',

  generatedInputId: Ember.computed(function() {
    return `${Ember.guidFor(this)}--input`;
  }),

  generatedLabelId: Ember.computed(function() {
    return `${Ember.guidFor(this)}--label`;
  }),

  input: Ember.computed('type', function() {
    return `ui-${this.get('type')}`;
  }),

  states: Ember.computed('disabled', function() {
    return {
      disabled: this.get('disabled')
    }
  })
});
