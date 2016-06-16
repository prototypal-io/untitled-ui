import Ember from 'ember';
import layout from 'untitled-ui/templates/components/ui-icon';

export default Ember.Component.extend({
  layout,
  tagName: '',

  kind: 'default',
  size: 'medium',

  frame: Ember.computed('kind', function() {
    return `ui-icon--${this.get('kind')}`;
  }),

  classes: Ember.computed('size', function() {
    return {
      size: `ui-font-size--${this.get('size')}`,
      class: this.get('class')
    }
  })
});
