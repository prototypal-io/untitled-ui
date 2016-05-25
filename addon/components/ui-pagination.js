import Ember from 'ember';
import layout from '../templates/components/ui-pagination';

export default Ember.Component.extend({
  layout,
  tagName: '',

  kind: 'default',
  size: 'medium',

  sizeClass: Ember.computed('size', function() {
    return `ui-font-size--${this.get('size')}`;
  }),

  frame: Ember.computed('kind', function() {
    return `ui-pagination--${this.get('kind')}`;
  }),

  classes: Ember.computed('size', function() {
    return {
      parent: 'ui-pagination',
      size: `ui-font-size--${this.get('size')}`
    }
  })
});
