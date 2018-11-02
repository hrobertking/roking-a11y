/* eslint func-names: 0, prefer-arrow-callback: 0, one-var: 0 */
const assert = require('assert');
const utilities = require('../src/index.js');

const Color = utilities.Color;

describe('utilities - Color', function () {
  it('calculates the correct rgb values given a hue, saturation, and lightness', function () {
    const color = new Color({ hue: 193, saturation: '67%', lightness: '28%' });
    assert.equal(color.red, 24);
    assert.equal(color.green, 98);
    assert.equal(color.blue, 119);
  });
  it('calculates the correct hsl values given a red, green, and blue', function() {
    const color = new Color({ red: 24, green: 98, blue: 118 });
    assert.equal(color.hue, 193);
    assert.equal(color.saturation, '67%');
    assert.equal(color.luminance, '28%');
  });
  it('calculates the correct red, green, and blue given a six-digit hexadecimal', function() {
    const color = new Color('#186276');
    assert.equal(color.red, 24);
    assert.equal(color.green, 98);
    assert.equal(color.blue, 118);
  });
  it('calculates the correct values given a three-digit hexadecimal', function() {
    const color = new Color('#f0d');
    assert.equal(color.red, 255);
    assert.equal(color.green, 0);
    assert.equal(color.blue, 221);
  });
});

