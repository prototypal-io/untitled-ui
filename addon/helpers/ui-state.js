import Ember from 'ember';

export function uiState([values, ...states]) {
  let classes = [];

  states.forEach((state) => {
    let parts = state.split(':');
    let stateName = parts[0];
    let activeClass = parts[1] || stateName;

    if (values[stateName]) {
      classes.push(activeClass);
    }
  });

  return classes.join(' ');
}

export default Ember.Helper.helper(uiState);
