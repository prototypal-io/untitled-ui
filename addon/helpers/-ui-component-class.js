import Ember from 'ember';

const FONT_SIZE_PATTERN = /font-size/;

export default Ember.Helper.helper(function ([prefix, ...classNames]) {
  let normalizedClassNames = classNames.reduce(function(names, name) {
    name.split(/\s/).forEach(function(part) {
      if (part && part !== '') {
        names.push(part);
      }
    });

    return names;
  }, []);

  return normalizedClassNames.reduce(function(string, name) {
    switch (true) {
      case (name === ':component'):
        return string += `${prefix} `;
      case (FONT_SIZE_PATTERN.test(name)):
        return string += `${name} `;
      default:
        return string += `${prefix}${name} `;
    }
  }, '');
});
