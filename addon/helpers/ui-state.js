import Ember from 'ember';

export function uiState([values, ...states]) {
  let classes = [];

  states.forEach((state) => {
    if (values[state]) {
      classes.push(state);
    }
  });

  return classes.join(' ');
}

export default Ember.Helper.helper(uiState);
