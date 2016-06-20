import Ember from 'ember';

const FONT_SIZE_PATTERN = /font-size/;
const FONTAWESOME_PATTERN = /^fa-/;

export default Ember.Helper.helper(function ([prefix, ...classNames]) {
  let normalizedClassNames = classNames.reduce(function(names, name) {
    if (typeof name === 'string') {
      name.split(/\s/).forEach(function(part) {
        if (part && part !== '') {
          names.push(part);
        }
      });
    }

    return names;
  }, []);

  return normalizedClassNames.reduce(function(string, name) {
    switch (true) {
      case (name === ':component'):
        var baseClass = prefix.replace(/(.*)--$/, '$1');
        return string += `${baseClass} `;
      case (FONT_SIZE_PATTERN.test(name)):
        return string += `${name} `;
      case (name === 'fa' || FONTAWESOME_PATTERN.test(name)):
        return string += `${name} `;
      default:
        return string += `${prefix}${name} `;
    }
  }, '');
});
