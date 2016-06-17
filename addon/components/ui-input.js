import Ember from 'ember';
import UIComponent from './ui-component';
import layout from '../templates/components/ui-input';

export default UIComponent.extend({
  layout,

  disabled: false,
  error: false,

  states: Ember.computed('disabled', 'error', function() {
    return {
      disabled: this.get('disabled'),
      error: this.get('error')
    }
  })
});
