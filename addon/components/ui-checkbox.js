import Ember from 'ember';
import UIComponent from './ui-component';
import layout from '../templates/components/ui-checkbox';

export default UIComponent.extend({
  layout,

  disabled: false,
  error: false,
  value: false,

  states: Ember.computed('disabled', 'error', 'value', function() {
    return {
      disabled: this.get('disabled'),
      error: this.get('error'),
      checked: this.get('value')
    }
  })
});
