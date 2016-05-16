import Ember from 'ember';
import layout from 'untitled-ui/templates/components/ui-button';

export default Ember.Component.extend({
  layout,

  tagName: '',
  size: 'medium',
  disabled: false,
  loading: false,

  frame: "ui-button--default",

  isDisabled: Ember.computed.or('disabled', 'loading'),

  sizeClass: Ember.computed('size', function() {
    return `ui-fontSize--${this.get('size')}`;
  }),

  actions: {
    onclick(event) {
      this.sendAction('onclick');
    }
  }
});
