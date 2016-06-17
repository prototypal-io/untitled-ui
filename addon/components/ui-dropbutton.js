import Ember from 'ember';
import layout from 'untitled-ui/templates/components/ui-dropbutton';

export default Ember.Component.extend({
  layout,
  tagName: '',

  kind: 'default',
  size: 'medium',
  disabled: false,
  loading: false,
  showPopup: false,

  frame: Ember.computed('kind', function() {
    return `ui-dropbutton--${this.get('kind')}`;
  }),

  classes: Ember.computed('size', function() {
    return {
      size: `ui-font-size--${this.get('size')}`,
      class: this.get('class')
    }
  }),

  isDisabled: Ember.computed.or('disabled', 'loading'),

  states: Ember.computed('isDisabled', 'loading', function() {
    return {
      disabled: this.get('isDisabled'),
      loading: this.get('loading')
    }
  }),

  targetId: Ember.computed(function() {
    return `${Ember.guidFor(this)}--target`;
  }),

  actions: {
    showPopup() {
      this.set('showPopup', true);
    },

    hidePopup() {
      this.set('showPopup', false);
    },

    togglePopup() {
      this.toggleProperty('showPopup');
    }
  }
});
