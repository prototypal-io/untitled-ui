import Ember from 'ember';
import { animate, stop } from "liquid-fire";

export default function(/*options*/) {
  stop(this.oldElement);

  const animations = Ember.A([]);

  const oldPrevious = $(this.oldElement).find('.ui-panel--ios-titlebar-action--label--previous');
  const oldPreviousIcon = $(this.oldElement).find('.ui-panel--ios-titlebar-action--icon');
  const oldTitle = $(this.oldElement).find('.ui-panel--ios-titlebar-title');
  const oldAction = $(this.oldElement).find('.ui-panel--ios-titlebar-action--label--action');
  const oldContent = $(this.oldElement).find('.ui-panel--ios-content');

  animations.pushObject(animate(oldPrevious, {
    opacity: 0,
    translateX: ['-30vw', '0vw']
  }, {
    duration: 500
  }));

  animations.pushObject(animate(oldPreviousIcon, {
    opacity: 0
  }, {
    duration: 500
  }));

  animations.pushObject(animate(oldTitle, {
    opacity: 0,
    translateX: ['-30vw', '0vw']
  }, {
    duration: 500
  }));

  animations.pushObject(animate(oldContent, {
    opacity: 0,
    translateX: ['-100vw', '0vw']
  }, {
    duration: 500
  }));

  animations.pushObject(animate(oldAction, {
    opacity: 0
  }, {
    duration: 500
  }));

  const newPrevious = $(this.newElement).find('.ui-panel--ios-titlebar-action--label--previous');
  const newPreviousIcon = $(this.newElement).find('.ui-panel--ios-titlebar-action--icon');
  const newTitle = $(this.newElement).find('.ui-panel--ios-titlebar-title');
  const newAction = $(this.newElement).find('.ui-panel--ios-titlebar-action--label--action');
  const newContent = $(this.newElement).find('.ui-panel--ios-content');

  animations.pushObject(animate(this.newElement, { opacity: 1 }, { duration: 0 }));

  animations.pushObject(animate(newPrevious, {
    opacity: 1,
    translateX: ['0vw', '30vw']
  }, {
    duration: 500
  }));

  animations.pushObject(animate(newPreviousIcon, {
    opacity: 1
  }, {
    duration: 500
  }));

  animations.pushObject(animate(newTitle, {
    opacity: 1,
    translateX: ['0vw', '30vw']
  }, {
    duration: 500
  }));

  animations.pushObject(animate(newContent, {
    opacity: 1,
    translateX: ['0vw', '100vw']
  }, {
    duration: 500
  }));

  animations.pushObject(animate(newAction, {
    opacity: 1,
    translateX: '0px'
  }, {
    duration: 500
  }));

  return Ember.RSVP.all(animations);
}
