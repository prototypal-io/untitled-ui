import Ember from 'ember';
import layout from 'untitled-ui/templates/components/ui-ripple';

// Based on the ember-paper implemenation
// https://github.com/miguelcobain/ember-paper/blob/8b7dd871496e312afad5ef0d9e928a36307ebdfd/addon/mixins/ripple-mixin.js
export default Ember.Component.extend({
  layout,

  tagName: "",
  rippleComponent: null,
  rippleElement: Ember.computed('rippleComponent', function() {
    return this.get('rippleComponent').$()[0];
  }),

  $(sel) {
    let el = this._renderNode.firstNode.nextElementSibling;
    return sel ? $(sel, el) : $(el);
  },

  didInsertElement() {
    this._super(...arguments);
    this.bindEvents();
  },

  registerRippleComponent(component) {
    this.set('rippleComponent', component);
  },

  bindEvents() {
    this.$().on('mousedown', Ember.run.bind(this, this.handleMousedown));
  },

  handleMousedown(event) {
    let rippleContainer = this.$()[0];

    // We need to calculate the relative coordinates if the target is a sublayer of the ripple element
    if (event.srcElement !== rippleContainer) {
      let layerRect = rippleContainer.getBoundingClientRect();
      let layerX = event.clientX - layerRect.left;
      let layerY = event.clientY - layerRect.top;

      this.get('rippleComponent').createRipple(layerX, layerY, rippleContainer);

    } else {
      this.get('rippleComponent').createRipple(event.offsetX, event.offsetY, rippleContainer);
    }
  }
});
