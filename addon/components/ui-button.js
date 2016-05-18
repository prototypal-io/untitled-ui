import Ember from 'ember';
import layout from 'untitled-ui/templates/components/ui-button';

export default Ember.Component.extend({
  layout,

  tagName: "",
  kind: "default",
  size: "medium",

  disabled: false,
  loading: false,
  active: false,
  focus: false,

  frame: Ember.computed('kind', function() {
    return `ui-button--${this.get('kind')}`;
  }),

  classes: Ember.computed('size', function() {
    return {
      parent: 'ui-button',
      size: `ui-font-size--${this.get('size')}`
    }
  }),

  isDisabled: Ember.computed.or('disabled', 'loading'),

  states: Ember.computed('isDisabled', 'loading', 'active', 'focus', function() {
    return {
      disabled: this.get('isDisabled'),
      loading: this.get('loading'),
      active: this.get('active'),
      focus: this.get('focus')
    }
  }),

  $(sel) {
    let el = this._renderNode.firstNode.nextSibling;
    return sel ? $(sel, el) : $(el);
  },

  didInsertElement() {
    this.$().on('webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd', () => {
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
