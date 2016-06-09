import Ember from 'ember';
import layout from '../templates/components/ui-popup';

export default Ember.Component.extend({
  layout,
  tagName: '',

  kind: 'tooltip',
  size: 'medium',

  targetId: null,
  attachment: 'bottom center',
  targetAttachment: 'top center',

  constraints: [{
    to: 'window',
    attachment: 'together'
  }],

  frame: Ember.computed('kind', function() {
    return `ui-popup--${this.get('kind')}`;
  }),

  classes: Ember.computed('size', function() {
    return {
      size: `ui-font-size--${this.get('size')}`
    }
  })
});
