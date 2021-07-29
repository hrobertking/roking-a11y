/**
 * @class Luminance
 * @author H Robert King <hrobertking@cathmhaol.com>
 * @requires roking-a11y:Color
 * @description The `Luminance` object allows for easy generation of a contrast ratio,
 * enabling comparison of two color definitions - `background` and `foreground`. Additionally,
 * the contrast ratio can be tested against a `threshold` object.
 * @param {Color|config} foreground
 * @param {Color} background
 *
 * @example
 * const l = new Luminance('#000', '#fff');
 * const pass = l.test(wcag.CONTRAST.AA.normal);
 *
 * @typedef config
 * @property {Color} background
 * @property {Color} foreground
 */
var Color = require('./color.js'); // eslint-disable-line global-require

module.exports = function Luminance(foreground, background) {
	/**
	 * @property background
	 * @type {Color}
	 */
	Object.defineProperty(this, 'background', {
		enumerable: true,
		get: getBg,
		set: setBg,
		writeable: true
	});

	/**
	 * @property contrast
	 * @type {number}
	 * @description Returns the luminance contrast ratio n:1 with two-digit precision
	 * @see {@link http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef}
	 */
	Object.defineProperty(this, 'contrast', {
		enumerable: true,
		get: getContrast
	});

	/**
	 * @property foreground
	 * @type {Color}
	 */
	Object.defineProperty(this, 'foreground', {
		enumerable: true,
		get: getFg,
		set: setFg,
		writeable: true
	});

	/**
	 * @method matrix
	 * @description Generates a contrast matrix using the provided palette
	 * @returns {LuminanceMatrix}
	 * @example
	 * const l = new Luminance().matrix(['#000', '#fff', '#f00']);
	 *
	 * @example
	 * const m = new Luminance().Matrix('#000, #fff, #f00');
	 */
	this.matrix = function matrix() {
		var table = {},
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
						color = isColor ? hex : new Color(hex.trim());

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
					var hcolor = el.hcolor;

					/* istanbul ignore else */
					if (hcolor) {
						hcolor = hcolor.replace(/\W/g, '');
						colors[hcolor] = el;
					}
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

	/**
	 * @method reset
	 * @description Resets the colors to their original values
	 * @returns {Luminance}
	 */
	this.reset = function reset() {
		this.foreground = initFg;
		this.background = initBg;
		return this;
	};

	/**
	 * @method search
	 * @description Modifies one or both Color properties to meet the specified level.
	 * @returns {Luminance}
	 * @param {number} level
	 * @param {Color} isolate
	 */
	this.search = function search(level, isolate) {
		/*
		 * if isolate is specified, only change the Color object specified in isolate,
		 * else change _both_ Color properties: foreground and background.
		 */
		var b = this.background,
			f = this.foreground;

		/* assign the appropriate adjustment methods and check properties */
		if (this.foreground.luminance < this.background.luminance) {
			this.foreground.adjust = this.foreground.darken;
			this.foreground.adjustProperty = 'canDarken';
			this.background.adjust = this.background.lighten;
			this.background.adjustProperty = 'canLighten';
		} else {
			this.foreground.adjust = this.foreground.lighten;
			this.foreground.adjustProperty = 'canLighten';
			this.background.adjust = this.background.darken;
			this.background.adjustProperty = 'canDarken';
		}

		if (isolate) {
			while (isolate[isolate.adjustProperty] && !this.test(level)) {
				isolate.adjust();
			}
		} else {
			while ((b[b.adjustProperty] || f[f.adjustProperty]) && !this.test(level)) {
				if (b[b.adjustProperty]) {
					b.adjust();
				}
				if (f[f.adjustProperty]) {
					f.adjust();
				}
			}
		}

		return this;
	};

	/**
	 * @method test
	 * @description Compares the contrast between Colors to the specified level.
	 * @returns {boolean}
	 * @param {number} level
	 */
	this.test = function test(level) {
		return !(this.contrast < level);
	};

	/**
	 * @method toHtml
	 * @description Outputs a matrix as an HTML table
	 * @returns {String}
	 * @example
	 * const lum = new Luminance().toHtml('#fff','#ff0', '#f0f', '#f00', '#0ff', '#0f0', '#00f', '#000');
	 * // lum === 
	 * <table>
	 * 	<thead>
	 * 		<tr>
	 * 			<td></td>
	 * 			<th scope="col" role="columnheader"><span class="pic" style="background-color: #ffffff;"></span> #ffffff</th>
	 * 			<th scope="col" role="columnheader"><span class="pic" style="background-color: #ff0000;"></span> #ff0000</th>
	 * 			<th scope="col" role="columnheader"><span class="pic" style="background-color: #ffff00;"></span> #ffff00</th>
	 * 			<th scope="col" role="columnheader"><span class="pic" style="background-color: #00ff00;"></span> #00ff00</th>
	 * 			<th scope="col" role="columnheader"><span class="pic" style="background-color: #00ffff;"></span> #00ffff</th>
	 * 			<th scope="col" role="columnheader"><span class="pic" style="background-color: #0000ff;"></span> #0000ff</th>
	 * 			<th scope="col" role="columnheader"><span class="pic" style="background-color: #ff00ff;"></span> #ff00ff</th>
	 * 			<th scope="col" role="columnheader"><span class="pic" style="background-color: #000000;"></span> #000000</th>
	 * 		</tr>
	 * 	</thead>
	 * 	<tbody>
	 * 		<tr>
	 * 			<th scope="row" role="rowheader"><span class="pic" style="background-color: #ffffff;"></span> #ffffff</th>
	 * 			<td>1.00</td>
	 * 			<td>4.00</td>
	 * 			<td>1.07</td>
	 * 			<td>1.37</td>
	 * 			<td>1.25</td>
	 * 			<td>8.59</td>
	 * 			<td>3.14</td>
	 * 			<td>21.00</td>
	 * 		</tr>
	 * 		<tr>
	 * 			<th scope="row" role="rowheader"><span class="pic" style="background-color: #ff0000;"></span> #ff0000</th>
	 * 			<td>4.00</td>
	 * 			<td>1.00</td>
	 * 			<td>3.72</td>
	 * 			<td>2.91</td>
	 * 			<td>3.19</td>
	 * 			<td>2.15</td>
	 * 			<td>1.27</td>
	 * 			<td>5.25</td>
	 * 		</tr>
	 * 		<tr>
	 * 			<th scope="row" role="rowheader"><span class="pic" style="background-color: #ffff00;"></span> #ffff00</th>
	 * 			<td>1.07</td>
	 * 			<td>3.72</td>
	 * 			<td>1.00</td>
	 * 			<td>1.28</td>
	 * 			<td>1.17</td>
	 * 			<td>8.00</td>
	 * 			<td>2.92</td>
	 * 			<td>19.56</td>
	 * 		</tr>
	 * 		<tr>
	 * 			<th scope="row" role="rowheader"><span class="pic" style="background-color: #00ff00;"></span> #00ff00</th>
	 * 			<td>1.37</td>
	 * 			<td>2.91</td>
	 * 			<td>1.28</td>
	 * 			<td>1.00</td>
	 * 			<td>1.09</td>
	 * 			<td>6.26</td>
	 * 			<td>2.29</td>
	 * 			<td>15.30</td>
	 * 		</tr>
	 * 		<tr>
	 * 			<th scope="row" role="rowheader"><span class="pic" style="background-color: #00ffff;"></span> #00ffff</th>
	 * 			<td>1.25</td>
	 * 			<td>3.19</td>
	 * 			<td>1.17</td>
	 * 			<td>1.09</td>
	 * 			<td>1.00</td>
	 * 			<td>6.85</td>
	 * 			<td>2.50</td>
	 * 			<td>16.75</td>
	 * 		</tr>
	 * 		<tr>
	 * 			<th scope="row" role="rowheader"><span class="pic" style="background-color: #0000ff;"></span> #0000ff</th>
	 * 			<td>8.59</td>
	 * 			<td>2.15</td>
	 * 			<td>8.00</td>
	 * 			<td>6.26</td>
	 * 			<td>6.85</td>
	 * 			<td>1.00</td>
	 * 			<td>2.74</td>
	 * 			<td>2.44</td>
	 * 		</tr>
	 * 		<tr>
	 * 			<th scope="row" role="rowheader"><span class="pic" style="background-color: #ff00ff;"></span> #ff00ff</th>
	 * 			<td>3.14</td>
	 * 			<td>1.27</td>
	 * 			<td>2.92</td>
	 * 			<td>2.29</td>
	 * 			<td>2.50</td>
	 * 			<td>2.74</td>
	 * 			<td>1.00</td>
	 * 			<td>6.70</td>
	 * 		</tr>
	 * 		<tr>
	 * 			<th scope="row" role="rowheader"><span class="pic" style="background-color: #000000;"></span> #000000</th>
	 * 			<td>21.00</td>
	 * 			<td>5.25</td>
	 * 			<td>19.56</td>
	 * 			<td>15.30</td>
	 * 			<td>16.75</td>
	 * 			<td>2.44</td>
	 * 			<td>6.70</td>
	 * 			<td>1.00</td>
	 * 		</tr>
	 * 	</tbody>
	 * </table>
	 */
	this.toHtml = function toHtml() {
		var HEXCOLOR = /^[0-9a-f]+$/i,
			lum = this.matrix([].slice.call(arguments)),
			tbl = '',
			tbh = [],
			tbb = [],
			thr;

		tbh.push([]);
		thr = tbh[tbh.length - 1];
		thr.push('<td></td>');

		Object.keys(lum).forEach(function (key) {
			var contrasts = lum[key],
				hex = key
					.replace(/undefined/i, '--------')
					.replace(HEXCOLOR, function toHex(m) { return '#' + m; }),
				pic = '',
				th = '',
				tr;

			/* istanbul ignore else */
			if (/#[0-9a-f]{6}/i.test(hex)) {
				pic = '<span class="pic" style="background-color: ' + hex + ';"></span>';
			}

			th = '<th scope="col" role="columnheader">' + pic + ' ' + hex + '</th>';

			// add the color to the head
			thr.push(th);

			// add a row to the body
			tbb.push([]);
			tr = tbb[tbb.length - 1];
			tr.push(th.replace(/columnheader/, 'rowheader').replace(/col/, 'row'));

			Object.keys(contrasts).forEach(function (contrast) {
				var cell = '<td>' + contrasts[contrast] + '</td>';

				tr.push(cell);
			});
		});

		tbl += '<table>\n';

		tbl += '\t<thead>\n' + tbh.map(function headerRow(row) {
			var html = '\t\t\t' + row.join('\n\t\t\t');

			return '\t\t<tr scope="row">\n' + html + '\n\t\t</tr>\n';
		}).join('') + '\t</thead>\n';

		tbl += '\t<tbody>\n' + tbb.map(function bodyRow(row) {
			var html = '\t\t\t' + row.join('\n\t\t\t');

			return '\t\t<tr scope="row">\n' + html + '\n\t\t</tr>\n';
		}).join('') + '\t</tbody>\n';

		tbl += '</table>\n';

		return tbl;
	};

	/* getters and setters */
	function getBg() {
		return bg;
	}
	function setBg(color) {
		bg = color instanceof Color ? color : new Color(color);
		initBg = initBg || new Color(color);
	}
	function getContrast() {
		if (fg && bg) {
			return contrast(fg, bg);
		}
	}
	function getFg() {
		return fg;
	}
	function setFg(color) {
		fg = color instanceof Color ? color : new Color(color);
		initFg = initFg || new Color(color);
	}

	/**
	 * @private
	 * @description Checks the datatype to verify it's defined in the Color module
	 * @returns {boolean}
	 * @param {*} data
	 */
	function isColorType(data) {
		var c = new Color();
		return c.isColorType(data);
	}
	/**
	 * @private
	 * @description Calculates the contrast between foreground and background
	 * @returns {Number}
	 * @param {Color} fColor
	 * @param {Color} bColor
	 */
	function contrast(fColor, bColor) {
		var f, b, n; // eslint-disable-line one-var, one-var-declaration-per-line

		/* istanbul ignore else */
		if (new Color().isColorType(fColor) && new Color().isColorType(bColor)) {
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
	}

	var bg, // eslint-disable-line vars-on-top,
		fg,
		initBg,
		initFg;

	if (foreground && foreground.background) {
		this.background = foreground.background;
	} else if (isColorType(background)) {
		this.background = background;
	}

	if (foreground && foreground.foreground) {
		this.foreground = foreground.foreground;
	} else if (isColorType(foreground)) {
		this.foreground = foreground;
	}
};
