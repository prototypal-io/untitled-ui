import Ember from 'ember';
import UIComponent from './ui-component';
import layout from '../templates/components/ui-tabs';

export default UIComponent.extend({
  layout,

  classes: Ember.computed('class', 'size', function() {
    return {
      class: this.get('class'),
      parent: 'ui-tabs',
      size: `ui-font-size--${this.get('size')}`
    }
  })
});
