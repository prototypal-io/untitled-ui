import Ember from 'ember';

export function uiState([values, ...states], options = {}) {
  let classes = [];
  let el = options.el;

  states.forEach((state) => {
    if (values[state]) {
      if (el) {
        classes.push(`${el}--${state}`);
      } else {
        classes.push(state);
      }
    }
  });

  return classes.join(' ');
}

export default Ember.Helper.helper(uiState);
