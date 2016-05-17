import Ember from 'ember';
import layout from '../templates/components/ui-modal-backdrop';

export default Ember.Component.extend({
  layout,

  tagName: '',

  frame: Ember.computed('kind', function() {
    return `ui-modal-backdrop--${this.get('kind')}`;
  })
});
