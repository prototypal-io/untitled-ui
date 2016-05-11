import Ember from 'ember';
import layout from '../templates/components/ui-modal';

export default Ember.Component.extend({
  layout,

  attributeBindings: ['tabindex'],

  // Allows modal to reveive focus so we can catch key presses
  tabindex: 0,

  generatedModalId: Ember.computed(function() {
    return `${Ember.guidFor(this)}__modal`;
  }),

  // Because ember-wormhole relocates the content of the modal we need to
  // assign a custom ID to the modal and look it up based on that.
  modalElement: Ember.computed('generatedModalId', function() {
    const generatedModalId = this.get('generatedModalId');
    return $(`#${generatedModalId}`);
  }),

  didInsertElement() {
    this.animateIn(this.get('modalElement'));
    this.$().focus();
  },

  breakdown() {
    return this.animateOut(this.get('modalElement'));
  },

  animateIn(element) {
    const modal = $(element).find('.ui-modal__modal');
    const backdrop = $(element).find('.ui-modal__backdrop');

    const modalAnimation = window.$.Velocity.animate(modal, {
      opacity: [1, 0],
      scaleX: [1, 0.7],
      scaleY: [1, 0.7]
    }, {
      duration: 200
    });

    const backdropAnimation = window.$.Velocity.animate(backdrop, {
      opacity: [1, 0]
    }, {
      duration: 200
    });

    return Ember.RSVP.all([modalAnimation, backdropAnimation]);
  },

  animateOut(element) {
    const modal = $(element).find('.ui-modal__modal');
    const backdrop = $(element).find('.ui-modal__backdrop');

    const modalAnimation = window.$.Velocity.animate(modal, {
      opacity: [0, 1],
      scaleX: [1.3, 1],
      scaleY: [1.3, 1]
    }, {
      duration: 200
    });

    const backdropAnimation = window.$.Velocity.animate(backdrop, {
      opacity: [0, 1]
    }, {
      duration: 200
    });

    return Ember.RSVP.all([modalAnimation, backdropAnimation]);
  },

  keyUp(event) {
    // ESC
    if (event.which === 27) {
      this.send('close');
    }
  },

  actions: {
    close() {
      this.breakdown().then(() => {
        this.sendAction('onclose');
      });
    }
  }
});
