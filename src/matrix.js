/**
 * @class LuminanceMatrix
 * @author H Robert King <hrobertking@cathmhaol.com>
 * @requires roking-a11y:Color
 * @requires roking-a11y:Luminance
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
var Luminance = require('./luminance.js');

module.exports = function LuminanceMatrix() {
	var palette = [].slice.call(arguments)
		.map(function splitter(arg) {
			if (/[{}]/.test(arg)) {
				// this is an object definition
				return JSON.parse('['+arg.replace(/#/g, '')+']');
			} else if (typeof arg === 'string' && arg.indexOf(',')) {
				// split any csv in the arguments into a string array
				return arg.split(',').map(function(c) {
					return { name: c, value: c };
				});
			}
			return arg instanceof Array ? arg : [arg];
		})
		.reduce(function combine(value, total) {
			// concatenate all arrays in the arguments into a single array
			return total.concat(value);
		}, [])
		.map(function toColor(def) {
			// convert each element in the combined array to a Color
			return def.value && def.value instanceof Color
				? def
				: new Color(def);
		})
		.filter(function filterNotColor(pc) {
			// filter out any elements that cannot be converted to a Color
			return typeof pc.hue === 'number';
		})
		.reduce(function (col, item) {
			var update = {};

			update[item.name] = item;
			return { ...col, ...update };
		}, {});

	Object.keys(palette).forEach(function (key) {
		palette[key].contrasts = Object.keys(palette)
			.filter(function (name) {
				return name !== key;
			})
			.reduce(function (col, colorKey) {
				var update = {};

				update[colorKey] = new Luminance(
					palette[key],
					palette[colorKey],
				);
				return { ...col, ...update };
			}, {});
	});

	Object.defineProperty(this, 'toHtmlTable', {
		value: function() {
			var table = document.createElement('table'),
				th = table.appendChild(document.createElement('thead')),
				thead = th.insertRow(),
				tbody = table.appendChild(document.createElement('tbody')),
				colors = Object.keys(palette),

				thc = thead.appendChild(document.createElement('td')),
				tbc,

				pic = function (hcolor, name) {
					var div = document.createElement('div'),
						icon = div.appendChild(document.createElement('span')),
						head = div.appendChild(document.createElement('span'));

					div.style.alignItems = 'center';
					div.style.display = 'flex';

					icon.style.backgroundColor = hcolor;
					icon.style.border = '1px solid #000';
					icon.style.borderRadius = '50%';
					icon.style.display = 'inline-block';
					icon.style.height = '0.75em';
					icon.style.marginRight = '0.25em';
					icon.style.width = '0.75em';

					head.setAttribute('title', hcolor);
					head.innerHTML = name;

					return div;
				};

			colors.forEach(function (color) {
				var tbr = tbody.appendChild(document.createElement('tr')),
					hcolor = palette[color].hcolor,
					name = palette[color].name;

				thc = thead.appendChild(document.createElement('th'));
				thc.setAttribute('role', 'columnheader');
				thc.setAttribute('scope', 'col');
				thc.appendChild(pic(hcolor, name));

				tbc = tbr.appendChild(document.createElement('th'));
				tbc.setAttribute('role', 'rowheader');
				tbc.setAttribute('scope', 'row');
				tbc.innerHTML = name;

				colors.forEach(function (lcr) {
					var contrast = palette[color].contrasts[lcr] || { contrast: '-' },
						threshold = '';

					if (contrast.contrast < 3) {
						threshold = 'fail';
					} else if (contrast.contrast < 4.5) {
						threshold = 'some';
					} else if (contrast.contrast !== '-') {
						threshold = 'pass';
					}
					tbc = tbr.appendChild(document.createElement('td'));
					tbc.innerHTML = contrast.contrast;
					tbc.className = threshold;
				});
			});
			return table;
		}
	});

	return this;
};
