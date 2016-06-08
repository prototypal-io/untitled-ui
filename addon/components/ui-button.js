import Ember from 'ember';
import layout from 'untitled-ui/templates/components/ui-button';

export default Ember.Component.extend({
  layout,

  tagName: "",
  kind: "default",
  size: "medium",

  class: null,

  disabled: false,
  loading: false,
  focus: false,
  browserActive: false,
  active: false,

  frame: Ember.computed('kind', function() {
    return `ui-button--${this.get('kind')}`;
  }),

  classes: Ember.computed('size', function() {
    return {
      size: `ui-font-size--${this.get('size')}`,
      class: this.get('class')
    }
  }),

  isDisabled: Ember.computed.or('disabled', 'loading'),

  states: Ember.computed('isDisabled', 'loading', 'active', 'browserActive', 'focus', function() {
    return {
      disabled: this.get('isDisabled'),
      loading: this.get('loading'),
      active: this.get('browserActive') || this.get('active'),
      focus: this.get('focus')
    }
  }),

  group: Ember.computed('buttonGroup.[]', function() {
    if (Ember.isEmpty(this.get('buttonGroup'))) {
      return null;
    }

    return {
      isFirstChild: this.get('buttonGroup.firstChild') === this,
      isLastChild: this.get('buttonGroup.lastChild') === this
    };
  }),

  $(sel) {
    let el = this._renderNode.firstNode.nextElementSibling;
    return sel ? $(sel, el) : $(el);
  },

  didInsertElement() {
    this.$().on('webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd', () => {
      this.toggleProperty('browserActive');
    });

    this.$().on('focusin', () => {
      this.set('focus', true);
    });

    this.$().on('focusout', () => {
      this.set('focus', false);
    });

    if (this.attrs.register) {
      Ember.run.next(this, function() {
        this.attrs.register(this);
      });
    }
  },

  actions: {
    onclick(event) {
      this.sendAction('onclick');
    }
  }
});
