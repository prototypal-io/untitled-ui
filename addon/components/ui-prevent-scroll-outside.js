import Ember from 'ember';
import layout from '../templates/components/ui-prevent-scroll-outside';

const KEYS_THAT_SCROLL_PAGE = [32, 37, 38, 39, 40];
const EVENTS = [
  { bindTo: element,  event: 'wheel',     callback: onElementScroll },
  { bindTo: element,  event: 'touchmove', callback: onElementScroll },
  { bindTo: window,   event: 'wheel',     callback: onWindowScroll },
  { bindTo: window,   event: 'touchmove', callback: onWindowScroll },
  { bindTo: document, event: 'keydown',   callback: handleKeyPress }
];

let element;

export default Ember.Component.extend({
  layout,

  didInsertElement() {
    element = this.element;

    EVENTS.forEach((item) => {
      (item.bindTo || element).addEventListener(item.event, item.callback);
    });
  },

  willDestroyElement() {
    EVENTS.forEach((item) => {
      (item.bindTo || element).removeEventListener(item.event, item.callback);
    });
  }
});

function onElementScroll(event) {
  if (targetWillScroll(event)) {
    event.stopPropagation();
  }
}

function onWindowScroll(event) {
  event.preventDefault();
}

function handleKeyPress(event) {
  if (KEYS_THAT_SCROLL_PAGE.indexOf(event.keyCode)  !== -1) {
    event.preventDefault();
  }
}

function targetWillScroll(event) {
  let target = event.target;

  // Find the element that will receive the scroll event
  while (target.scrollHeight <= target.clientHeight) {
    if (target === element) {
      break;
    }
    target = target.parentElement;
  }

  const willScrollDown = target.scrollTop < (target.scrollHeight - target.offsetHeight) && event.deltaY > 0;
  const willScrollUp = target.scrollTop > 0 && event.deltaY < 0;

  return willScrollUp || willScrollDown;
}
