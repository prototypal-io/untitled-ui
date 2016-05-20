import Ember from 'ember';
import layout from 'untitled-ui/templates/components/ui-ripple-animation';

export default Ember.Component.extend({
  layout,

  tagName: "",

  $(sel) {
    let el = this._renderNode.firstNode;
    return sel ? $(sel, el) : $(el);
  },

  didInsertElement() {
    this._super(...arguments);
    this.attrs.parent.value.registerRippleComponent(this);
  },

  createRipple(left, top, container) {
    let ctrl = this;
    let ripple = $('<div class="ui-ripple__animation__ripple"></div>');
    let width = container.clientWidth;
    let height = container.clientHeight;
    let size = Math.max(width, height);

    $(ripple).css({
      left: `${left - (size / 2)}px`,
      top: `${top + (size / 2 * -1)}px`,
      width: `${size}px`,
      height: `${size}px`
    });

    let animationElement = this.$();
    animationElement.append(ripple);

    const animation = window.$.Velocity.animate(ripple, {
      opacity: [0, 1, 0],
      scaleX: [1, 0.1],
      scaleY: [1, 0.1]
    }, {
      duration: 900
    });

    animation.then(() => {
      ripple.remove();
    });
  }
});
