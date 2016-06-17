import Ember from 'ember';
import UIComponent from './ui-component';
import layout from '../templates/components/ui-button-group';

export default UIComponent.extend({
  layout,

  buttons: Ember.computed(function() {
    return Ember.A([]);
  }),

  firstChild: Ember.computed.alias('buttons.firstObject'),
  lastChild: Ember.computed.alias('buttons.lastObject'),

  actions: {
    registerButton(button) {
      this.get('buttons').pushObject(button);
    }
  }
});
