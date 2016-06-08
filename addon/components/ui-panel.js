import Ember from 'ember';
import layout from '../templates/components/ui-panel';

export default Ember.Component.extend({
  layout,
  tagName: '',

  kind: 'default',
  size: 'medium',

  sizeClass: Ember.computed('size', function() {
    return `ui-font-size--${this.get('size')}`;
  }),

  frame: Ember.computed('kind', function() {
    return `ui-panel--${this.get('kind')}`;
  }),
});
