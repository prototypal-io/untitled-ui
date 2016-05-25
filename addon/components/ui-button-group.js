import Ember from 'ember';
import layout from '../templates/components/ui-button-group';

export default Ember.Component.extend({
  layout,
  tagName: '',

  kind: 'default',
  size: 'medium',

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
