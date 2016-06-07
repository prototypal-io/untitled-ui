import Ember from 'ember';

const FONT_SIZE_PATTERN = /font-size/;

export default Ember.Helper.helper(function ([prefix, ...classNames]) {
  return classNames.reduce(function(string, name) {
    if (!name) return string;

    let trimmedName = name.replace(/\s/g, '');
    if (trimmedName === '') return string;

    switch (true) {
      case (trimmedName === ':component'):
        return string += `${prefix} `;
      case (FONT_SIZE_PATTERN.test(trimmedName)):
        return string += `${trimmedName} `;
      default:
        return string += `${prefix}${trimmedName} `;
    }
  }, '');
});
