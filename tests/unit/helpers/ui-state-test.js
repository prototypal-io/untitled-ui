import { uiState } from 'dummy/helpers/ui-state';
import { module, test } from 'qunit';

module('Unit | Helper | ui state');

test('returns truthful states', function(assert) {
  let states = { active: true, loading: true, disabled: false };

  let result = uiState([states, 'active', 'loading', 'disabled']);

  assert.equal(result, 'active loading', 'truthy states returned');
});

test('skips truthful states that are not asked for', function(assert) {
  let states = { active: true, notAskedFor: true  };

  let result = uiState([states, 'active']);

  assert.equal(result, 'active', 'state that was not asked for not included');
});

test('prefixes classes for a given element', function(assert) {
  let states = { active: true };

  let result = uiState([states, 'active'], { el: 'ui-foobar' });

  assert.equal(result, 'ui-foobar--active', 'truthy states returned');
});
