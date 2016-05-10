import Ember from 'ember';
import layout from '../templates/components/ui-field';

export default Ember.Component.extend({
  layout,
  tagName: '',
    
  label: null,
  type: 'ui-input',
  
  generatedInputId: Ember.computed(function() {
    return `${Ember.guidFor(this)}__input`;
  }),
  
  generatedLabelId: Ember.computed(function() {
    return `${Ember.guidFor(this)}__label`;
  }),
});
