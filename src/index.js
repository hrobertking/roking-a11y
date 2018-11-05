/**
 * @module roking-a11y
 * @author H Robert King <hrobertking@cathmhaol.com>
 * @description Accessibility evaluation tools
 */
const color = require('./color.js');
const luminance = require('./luminance.js');
const readability = require('./readability.js');
const wcag = require('./wcag.js');

exports.Color = color;
exports.Luminance = luminance;
exports.Readability = readability;
exports.WCAG = wcag;

