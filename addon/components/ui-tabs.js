import Ember from 'ember';
import layout from '../templates/components/ui-tabs';

export default Ember.Component.extend({
  layout,
  tagName: '',

  kind: 'default',
  size: 'medium',

  frame: Ember.computed('kind', function() {
    return `ui-tabs--${this.get('kind')}`;
  }),

  classes: Ember.computed('size', function() {
    return {
      parent: 'ui-tabs',
      size: `ui-font-size--${this.get('size')}`
    }
  }),
});
