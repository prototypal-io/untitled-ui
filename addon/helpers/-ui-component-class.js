import Ember from 'ember';

export default Ember.Helper.helper(function ([prefix, ...classNames]) {
  var classString = '';

  classNames.forEach(function(name) {
    if (!name) return;

    var trimmedName = name.replace(/\s/g, '');
    if (trimmedName === '') return;

    if (trimmedName === ':component') {
      classString += `${prefix} `;
    } else {
      classString += `${prefix}${trimmedName} `;
    }
  });

  return classString;
});
