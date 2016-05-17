import Ember from 'ember';
import layout from 'untitled-ui/templates/components/ui-button';

export default Ember.Component.extend({
  layout,

  tagName: '',
  size: 'medium',
  disabled: false,
  loading: false,
  active: false,
  focus: false,

  frame: "ui-button--default",

  isDisabled: Ember.computed.or('disabled', 'loading'),

  sizeClass: Ember.computed('size', function() {
    return `ui-fontSize--${this.get('size')}`;
  }),

  $(sel) {
    let el = this._renderNode.firstNode;
    return sel ? $(sel, el) : $(el);
  },

  didInsertElement() {
    this.$().on('webkitTransitionEnd', () => {
      this.toggleProperty('active');
    });
    this.$().on('focusin', () => {
      this.set('focus', true);
    });
    this.$().on('focusout', () => {
      this.set('focus', false);
    });
  },

  actions: {
    onclick(event) {
      this.sendAction('onclick');
    }
  }
});
