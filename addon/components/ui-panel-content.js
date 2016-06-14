import Ember from 'ember';
import layout from '../templates/components/ui-panel-content';

export default Ember.Component.extend({
  layout,
  tagName: '',

  kind: 'default',
  size: 'medium',

  classes: Ember.computed('class', 'size', function() {
    return {
      class: this.get('class'),
      size: `ui-font-size--${this.get('size')}`
    };
  }),

  frame: Ember.computed('kind', function() {
    return `ui-panel-content--${this.get('kind')}`;
  })
});
