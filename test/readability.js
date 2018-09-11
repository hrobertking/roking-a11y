/* eslint func-names: 0, prefer-arrow-callback: 0, one-var: 0 */
const assert = require('assert');
const utilities = require('../src/index.js');
const Readability = utilities.readability;

describe('utilities - readability', function () {
  it('calculates the correct score for English', function () {
    const evaluator = new Readability('drink this medicine');
    assert.equal(evaluator.avg, 36);
  });
  it('calculates the correct score for Spanish', function () {
    const evaluator = new Readability('tomar este medicina');
    assert.equal(evaluator.avg, 36);
  });
});

