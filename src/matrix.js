/**
 * @class LuminanceMatrix
 * @author H Robert King <hrobertking@cathmhaol.com>
 * @requires roking-a11y:Color
 * @description Creates a luminance matrix allowing the comparison of multiple colors
 * @param {Color[]|String} colors
 *
 * @example
 * const l = new LuminanceMatrix(['#000', '#fff', '#f00']);
 *
 * @example
 * const m = new LuminanceMatrix('#000, #fff, #f00');
 */
var Color = require('./color.js');

module.exports = function LuminanceMatrix() {
	/**
	 * @private
	 * @description Calculates the contrast between foreground and background
	 * @returns {Number}
	 * @param {Color} fColor
	 * @param {Color} bColor
	 */
	function contrast(fColor, bColor) {
		var f, b, n; // eslint-disable-line one-var, one-var-declaration-per-line

		// compensate for any bleedthru from opacity
		f = new Color({
			red: ((1 - fColor.opacity) * bColor.red) +
				(fColor.opacity * fColor.red),
			green: ((1 - fColor.opacity) * bColor.green) +
				(fColor.opacity * fColor.green),
			blue: ((1 - fColor.opacity) * bColor.blue) +
				(fColor.opacity * fColor.blue)
		}).luminance + 5;
		b = bColor.luminance + 5;
		n = f / b;

		// normalize for inverted background and foreground luminance
		n = f < b ? 1 / n : n;

		return n.toFixed(2);
	}

	var table = {}, // eslint-disable-line vars-on-top
		colors = {},
		palette = [].slice.call(arguments)
			.map(function splitter(arg) {
				// split any csv in the arguments into a string array
				if (typeof arg === 'string' && arg.indexOf(',')) {
					return arg.split(',');
				}
				return arg instanceof Array ? arg : [arg];
			})
			.reduce(function combine(value, total) {
				// concatenate all arrays in the arguments into a single array
				return total.concat(value);
			}, [])
			.map(function toColor(hex) {
				// convert each element in the combined array to a Color
				var isColor = hex instanceof Color,
					color = isColor ? hex : new Color(hex);

				return color;
			})
			.filter(function filterNotColor(el) {
				// filter out any elements that cannot be converted to a Color
				return typeof el.hue === 'number';
			})
			.sort(function byHue(a, b) {
				// sort the colors by hue
				return a.hue - b.hue;
			})
			.map(function toHex(el) {
				// add the Color to the library using the hexadecimal value as the key
				// and return the hexadecimal value to the array
				var hcolor = el.hcolor.replace(/\W/g, '');

				colors[hcolor] = el;
				return hcolor;
			});

	palette.forEach(function buildTable(h) {
		var values = {};

		palette.forEach(function addContrast(p) {
			values[p] = contrast(colors[h], colors[p]);
		});
		table[h] = values;
	});

	return table;
};
