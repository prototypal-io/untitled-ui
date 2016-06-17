import Ember from 'ember';
import layout from 'untitled-ui/templates/components/ui-dropbutton-trigger';

export default Ember.Component.extend({
  layout,
  tagName: '',

  kind: 'default',
  size: 'medium',

  frame: Ember.computed('kind', function() {
    return `ui-dropbutton-trigger--${this.get('kind')}`;
  }),

  classes: Ember.computed('size', function() {
    return {
      size: `ui-font-size--${this.get('size')}`,
      class: this.get('class')
    }
  })
});
