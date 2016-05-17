import Ember from 'ember';
import layout from '../templates/components/ui-panel-content';

export default Ember.Component.extend({
  layout,
  tagName: '',

  kind: 'default',

  frame: Ember.computed('kind', function() {
    return `ui-panel-content--${this.get('kind')}`;
  })
});
