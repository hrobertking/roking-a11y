/* eslint func-names: 0, prefer-arrow-callback: 0, one-var: 0 */
const assert = require('assert');
const utilities = require('../src/index.js');

const Color = utilities.Color;
let udef;

describe('utilities - Color', function () {
  it('does not initialize if not given a valid color type', function () {
    assert.equal((new Color({ hue: 10, lightness: 0.28 })).red, udef);
  });
  it('calculates the correct rgb values given a hue, saturation, and lightness', function () {
    const color = new Color({ hue: 10, saturation: 0.67, lightness: 0.28 });
    assert.equal(color.red, 119);
    assert.equal(color.green, 40);
    assert.equal(color.blue, 24);
    assert.equal(color.luminance, 5.505469909001183);
    assert.equal(color.opacity, 1);

    color.hue = 270;
    color.saturation = '90%';
    color.lightness = '90%';
    assert.equal(color.toString(), '#e6cffc');

    color.hue = -350;
    color.saturation = 0.67;
    color.lightness = 0.28;
    assert.equal(color.hcolor, '#772818');

    color.hue = 370;
    assert.equal(color.hcolor, '#772818');
  });
  it('does not calculate prematurely', function () {
    const color = new Color();
    color.hue = 204;
    assert.equal(color.red, udef);
  });
  it('calculates the correct opacity', function () {
    const color = new Color({ hue: -350, saturation: 0.67, lightness: 0.28 });
    color.opacity = 60;
    assert.equal(color.opacity, 0.6);

    color.opacity = 0.7;
    assert.equal(color.opacity, 0.7);

    color.opacity = '90%';
    assert.equal(color.opacity, 0.9);

    color.opacity = 'ef';
    assert.equal(color.opacity, 0.94);

    color.opacity = 'zz';
    assert.equal(color.opacity, 0.94);
  });
  it('calculates the correct rgb values given a negative hue', function () {
    const color = new Color({ hue: -350, saturation: 0.67, lightness: 0.28 });
    assert.equal(color.red, 119);
    assert.equal(color.green, 40);
    assert.equal(color.blue, 24);
  });
  it('calculates the correct hsl values given a red, green, and blue', function () {
    const color = new Color({ red: 24, green: 98, blue: 118 });
    assert.equal(color.hue, 193);
    assert.equal(color.saturation, '67%');
    assert.equal(color.lightness, '28%');
    assert.equal(color.luminance, 10.237560921354328);
  });
  it('calculates the correct values given a three-digit hexadecimal', function () {
    const color = new Color('#f0d');
    assert.equal(color.red, 255);
    assert.equal(color.green, 0);
    assert.equal(color.blue, 221);
    assert.equal(color.luminance, 26.48045803081662);
    assert.equal(color.opacity, 1);
  });
  it('calculates the correct values given a four-digit hexadecimal', function () {
    const color = new Color('#f0de');
    assert.equal(color.red, 255);
    assert.equal(color.green, 0);
    assert.equal(color.blue, 221);
    assert.equal(color.luminance, 26.48045803081662);
    assert.equal(color.opacity, 0.93);
  });
  it('calculates the correct red, green, and blue given a six-digit hexadecimal', function () {
    const color = new Color('#186276');
    assert.equal(color.red, 24);
    assert.equal(color.green, 98);
    assert.equal(color.blue, 118);
    assert.equal(color.luminance, 10.237560921354328);
    assert.equal(color.opacity, 1);
  });
  it('calculates the correct red, green, and blue given a eight-digit hexadecimal', function () {
    const color = new Color('#186276ef');
    assert.equal(color.red, 24);
    assert.equal(color.green, 98);
    assert.equal(color.blue, 118);
    assert.equal(color.luminance, 10.237560921354328);
    assert.equal(color.opacity, 0.94);
  });
  it('calculates the correct hexadecimal values for all eight digits', function () {
    const color = new Color({ red: 24, green: 98, blue: 118, opacity: 0.94 });
    assert.equal(color.toString(), '#186276ef');
  });
  it('calculates after modification of red, green, and blue values', function () {
    const color = new Color('#186276');
    assert.equal(color.red, 24);
    assert.equal(color.green, 98);
    assert.equal(color.blue, 118);

    color.red = 'aa';
    color.green = 'ff';
    color.blue = 'aa';
    assert.equal(color.hcolor, '#aaffaa');

    color.red = 24;
    color.green = 98;
    color.blue = 118;
    assert.equal(color.hcolor, '#186276');
  });
  it('calculates the correct red, green, and blue, given an hcolor', function () {
    const color = new Color();
    color.hcolor = '#ZZZ';
    assert.equal(color.red, udef);

    color.hcolor = '#186276';
    assert.equal(color.red, 24);
    assert.equal(color.green, 98);
    assert.equal(color.blue, 118);
  });
  it('calculates the correct hsl values when lightness and saturation are modified', function () {
    const color = new Color({ red: 24, green: 98, blue: 118 });
    color.lightness = 0.5;
    color.saturation = 0.3;
    assert.equal(color.red, 89);
    assert.equal(color.green, 149);
    assert.equal(color.blue, 166);
  });
  it('calculates gray when there is no saturation', function () {
    const color = new Color({ hue: 0, saturation: 0, lightness: 0.4 });
    assert.equal(color.red, 102);
    assert.equal(color.green, 102);
    assert.equal(color.blue, 102);
  });
  it('calculates hsl only when all rgb values are set', function () {
    const color = new Color();
    color.red = 102;
    assert.equal(color.hcolor, udef);
    assert.equal(color.luminance, udef);
  });
  it('validates color types', function () {
    const color = new Color();
    assert.equal(color.isColorType('#abc'), true);
    assert.equal(color.isColorType('#abcd'), true);
    assert.equal(color.isColorType('#abcdef'), true);
    assert.equal(color.isColorType('#012345af'), true);
    assert.equal(color.isColorType({ red: 0, green: 0, blue: 0 }), true);
    assert.equal(color.isColorType({ hue: 0, saturation: 0, lightness: 0 }), true);
    assert.equal(color.isColorType({ hue: 0, lightness: 0 }), false);
    assert.equal(color.isColorType({ red: 0, saturation: 0, blue: 0 }), false);
    assert.equal(color.isColorType('#01234g'), false);
    assert.equal(color.isColorType('#01'), false);
    assert.equal(color.isColorType('#012345679'), false);
  });
  it('calculates -darken- and -lighten- as -black- and -white- when color is undefined', function () {
    const dark = new Color().darken();
    const light = new Color().lighten();
    assert.equal(dark.toString(), '#000000');
    assert.equal(light.toString(), '#ffffff');
  });
  it('darkens the color', function () {
    const color = new Color('#fff').darken();
    assert.equal(color.toString(), '#fefefe');
    color.darken(9);
    assert.equal(color.toString(), '#f5f5f5');
  });
  it('darkens to black', function () {
    const color = new Color('#001');
    assert.equal(color.canDarken, true);
    color.darken(100);
    assert.equal(color.canDarken, false);
    assert.equal(color.toString(), '#000000');
  });
  it('lightens the color', function () {
    const color = new Color('#000').lighten();
    assert.equal(color.toString(), '#010101');
    color.lighten(9);
    assert.equal(color.toString(), '#0a0a0a');
  });
  it('lightens to white', function () {
    const color = new Color('#ffe');
    assert.equal(color.canLighten, true);
    color.lighten(100);
    assert.equal(color.canLighten, false);
    assert.equal(color.toString(), '#ffffff');
  });
});

