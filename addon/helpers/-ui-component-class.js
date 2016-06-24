import Ember from 'ember';

const FONT_SIZE_PATTERN = /font-size/;
const FONTAWESOME_PATTERN = /^fa-/;

const {
  isPresent
} = Ember;

export function uiComponentClass(classNames, options = {}) {
  let { prefix } = options;
  let normalizedClassNames = normalizeClassNames(classNames);

  return normalizedClassNames.reduce((classes, name) => {
    switch (true) {
      case (name === ':component'):
        return isPresent(prefix) ? `${classes}${prefix} ` : classes;
      case (isFontSize(name) || isFontAwesome(name)):
        return `${classes}${name} `;
      case (isPresent(prefix) && isPresent(name)):
        return `${classes}${prefix}--${name} `;
      default:
        return `${classes}${name} `;
    }
  }, '');
}

function normalizeClassNames(classNames) {
  return classNames.reduce(function(names, name) {
    if (typeof name === 'string') {
      name.split(/\s/).forEach(function(part) {
        if (part && part !== '') {
          names.push(part);
        }
      });
    }

    return names;
  }, []);
}

function isFontAwesome(name) {
  return name === 'fa' || FONTAWESOME_PATTERN.test(name);
}

function isFontSize(name) {
  return FONT_SIZE_PATTERN.test(name);
}

export default Ember.Helper.helper(uiComponentClass);
