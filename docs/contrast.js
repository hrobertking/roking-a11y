/**
 * @class Color
 * @author H Robert King <hrobertking@gmail.com>
 * @description The `Color` object automatically converts between the three different color
 * specifications: a hexadecimal number, an object with `red`, `green`, and `blue` values, and an
 * object with `hue`, `saturation`, and `lightness` values and simplifies modification of the
 * values.
 * @param {hcolor|rgb|hsl} color
 * @param {string} [cname] Name of the color, defaults to the hexadecimal value
 *
 * @example
 * const color = new Color({ hue: 204, saturation: '70%', lightness: '60%', name: 'roking-a11y blue' });
 * const color = new Color({ red: 24, green: 98, blue: 118 });
 * const color = new Color('#186276');
 * const color = new Color('#f0d', 'pink');
 *
 * @typedef {tinyint} A number between 0 and 255
 *
 * @typedef {hcolor} A 6-digit or 8-digit hexadecimal string with red in the first two digits, green
 * in the third and fourth digits, blue in the fifth and sixth digits, and the opacity in the
 * seventh and eighth digits (assumed to be ff), or a 3-digit or 4-digit hexadecimal string with red
 * in the first digit, green in the second digit, blue in the third digit, and the opacity in the
 * fourth digit. If the 3-digit or 4-digit length is used, the digits are expanded by repitition.
 * For example, if the value is 'ABC' or 'ABCD', the expanded value is 'AABBCC' or 'AABBCCDD',
 * respectively.
 *
 * @typedef {rgb} An object with red, green, and blue values.
 * @property {tinyint} blue
 * @property {tinyint} green
 * @property {tinyint} red
 * @property {number} opacity
 *
 * @typedef {hsl} An object with hue, lightness, and saturation.
 * @property {number} hue
 * @property {number} lightness
 * @property {number} saturation
 * @property {number} opacity
 */
/* eslint-disable no-bitwise, no-mixed-operators */
function Color(value, cname) {
	/**
	 * @typedef RGB
	 * @property {Number} red - Tinyint value for red
	 * @property {Number} green - Tinyint value for green
	 * @property {Number} blue - Tinyint value for blue
	 * @property {Number} opacity - Percentage opaque
	 * @property {String} name - Name of the color, defaults to HCOLOR equivalent
	 *
	 * @typedef HSL
	 * @property {Number} hue - Color wheel degree representation of hue
	 * @property {Number} saturation - Percentage of saturation
	 * @property {Number} lightness - Percentage of lightness
	 * @property {Number} opacity - Percentage opaque
	 * @property {String} name - Name of the color, defaults to HCOLOR equivalent
	 *
	 * @typedef HCOLOR
	 * @type {String} 3, 4, 6, or 8 byte hexadecimal string representing 3 or 4 segments for red, green, blue, and opacity
	 */
	
	/**
	 * @property blue
	 * @type {Number} tinyint
	 */
	Object.defineProperty(this, 'blue', {
		enumerable: true,
		get: getB,
		set: setB,
		writeable: true
	});

	/**
	 * @property brightness
	 * @type {Number}
	 * @description Pure luminance, not used by WCAG 2.x
	 */
	Object.defineProperty(this, 'brightness', {
		enumerable: true,
		get: getBrightness,
	});
	
	/**
	 * @property canDarken
	 * @type {Boolean}
	 * @description A boolean representing a luminance greater than zero.
	 */
	Object.defineProperty(this, 'canDarken', {
		enumerable: true,
		get: function canDarken() {
			return this.luminance > 0;
		}
	});

	/**
	 * @property canLighten
	 * @type {Boolean}
	 * @description A boolean representing a luminance less than one hundred
	 */
	Object.defineProperty(this, 'canLighten', {
		enumerable: true,
		get: function canLighten() {
			return this.luminance < 100;
		}
	});

	/**
	 * @property green
	 * @type {Number} tinyint
	 */
	Object.defineProperty(this, 'green', {
		enumerable: true,
		get: getG,
		set: setG,
		writeable: true
	});

	/**
	 * @property hcolor
	 * @type {HCOLOR}
	 * @description The hexadecimal color values as a 6-digit or 8-digit string
	 */
	Object.defineProperty(this, 'hcolor', {
		enumerable: true,
		get: getHColor,
		set: setHColor,
		writeable: true
	});

	/**
	 * @property hue
	 * @type {Number} tinyint
	 */
	Object.defineProperty(this, 'hue', {
		enumerable: true,
		get: getH,
		set: setH,
		writeable: true
	});

	/**
	 * @property lightness
	 * @type {Number} tinyint
	 */
	Object.defineProperty(this, 'lightness', {
		enumerable: true,
		get: getL,
		set: setL,
		writeable: true
	});
	
	/**
	 * @property LINEAR_MODIFIER
	 * @type {Object}
	 * @property {Float} red
	 * @property {Float} green
	 * @property {Float} blue
	 */
	Object.defineProperty(this, 'LINEAR_MODIFIER', {
		enumerable: true,
		get: getLinearModifier,
		set: setLinearModifier,
		writeable: true,
	});

	/**
	 * @property luminance
	 * @type {Number}
	 * @description A number 0..100 (inclusive) representing the luminance of a color.
	 * @see {@link https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef}
	 * @see {@link https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests}
	 */
	Object.defineProperty(this, 'luminance', {
		enumerable: true,
		get: getLuminance,
	});
	
	/**
	 * @property name
	 * @type {String}
	 * @description The name given to the color by the author. Defaults to the HCOLOR equivalent.
	 */
	Object.defineProperty(this, 'name', {
		enumerable: true,
		get: getName,
		set: setName,
		writeable: true,
	});

	/**
	 * @property opacity
	 * @type {Number}
	 * @description A floating-point value representing the percentage of the background color blocked
	 * @default 1
	 */
	Object.defineProperty(this, 'opacity', {
		enumerable: true,
		get: getAlpha,
		set: setAlpha,
		writeable: true
	});

	/**
	 * @property red
	 * @type {Number} tinyint
	 */
	Object.defineProperty(this, 'red', {
		enumerable: true,
		get: getR,
		set: setR,
		writeable: true
	});

	/**
	 * @property saturation
	 * @type {Number} tinyint
	 */
	Object.defineProperty(this, 'saturation', {
		enumerable: true,
		get: getS,
		set: setS,
		writeable: true
	});

	/**
	 * @method darken
	 * @description Darker the color.
	 * @returns {Color}
	 * @param {number} degree - how much darker the new value should be
	 */
	this.darken = function darken(degree) {
		var color = this.toString() || '#000000',
			n = parseInt(color.replace(/^#/, ''), 16),
			R = Math.max(0, (n >> 16) - (degree || 1)),
			G = Math.max(0, (n & 0x0000FF) - (degree || 1)),
			B = Math.max(0, ((n >> 8) & 0x00FF) - (degree || 1)),
			h = (G | (B << 8) | (R << 16)).toString(16),
			rgb = convertHColorToRgb(`000000${h}`.substr(-6)),
		    	hsl = convertRgbToHsl(rgb);

		if (rgb) {
			r = rgb.red;
			g = rgb.green;
			b = rgb.blue;
		}
		if (hsl) {
			h = hsl.hue;
			s = hsl.saturation;
			l = hsl.lightness;
		}

		return this;
	};

	/**
	 * @method lighten
	 * @description Lighten the color.
	 * @returns {Color}
	 * @param {number} degree - how much lighter the new value should be
	 */
	this.lighten = function lighten(degree) {
		var color = this.toString() || '#ffffff',
			n = parseInt(color.replace(/^#/, ''), 16),
			R = Math.min((n >> 16) + (degree || 1), 255),
			G = Math.min((n & 0x0000FF) + (degree || 1), 255),
			B = Math.min(((n >> 8) & 0x00FF) + (degree || 1), 255),
			h = (G | (B << 8) | (R << 16)).toString(16),
			rgb = convertHColorToRgb(`000000${h}`.substr(-6)),
		    	hsl = convertRgbToHsl(rgb);

		if (rgb) {
			r = rgb.red;
			g = rgb.green;
			b = rgb.blue;
		}
		if (hsl) {
			h = hsl.hue;
			s = hsl.saturation;
			l = hsl.lightness;
		}

		return this;
	};

	/**
	 * @method isColorType
	 * @description Returns true if the provided data is one of `hcolor`, `rgb`, or `hsl`
	 * @returns {Boolean}
	 * @param {RGB|HSL|HCOLOR} data
	 */
	this.isColorType = function isColorType(data) {
		if (typeof data === 'string') {
			return Object.keys(REGEX)
				.map(function(key) {
					return REGEX[key]
						.map(function (regex) {
							return regex.test(data);
						})
						.filter(function (test) {
							return test;
						})
						.length > 0;
				})
				.filter(function (test) {
					return test;
				})
				.length > 0;
		} else {
			return isHSL(data) || isRGB(data);
		}
		return false;
	};

	/**
	 * @method toString
	 * @description Returns a hexadecimal color string as used in CSS
	 * @returns {String}
	 */
	this.toString = function toString() {
		return this.hcolor;
	};

	// getters and setters
	function getAlpha() {
		return typeof a !== 'number' ? 1 : round(a);
	}
	function setAlpha(n) {
		// n may be a %, a hexadecimal, or digits
		var fp;

		if (typeof n === 'string' && /%/.test(n)) {
			fp = Number(n.replace(/%/g, '')) / 100;
		} else if (typeof n === 'string' && /^0|[a-f]/i.test(n)) {
			// if the number is a hexadecimal, the percentage is n divided by 255
			fp = parseInt(n, 16) / 255;
		} else {
			fp = Number(n);
		}
		if (!Number.isNaN(fp)) {
			a = round(Math.floor(fp) > 0 ? fp / 100 : fp);
		}
	}
	function getB() {
		return b;
	}
	function setB(n) {
		if (typeof n === 'string' && /[a-f]/i.test(n)) {
			b = strToNum(n);
		} else {
			b = Number(n);
		}
		
		var hsl = convertRgbToHsl({ red: r, green: g, blue: b });
		if (hsl) {
			h = hsl.hue;
			s = hsl.saturation;
			l = hsl.lightness;
		}
	}
	function getBrightness() {
		if (isSet(r) && isSet(g) && isSet(b)) {
			var mod = [
					LINEAR_MODIFIER.red,
					LINEAR_MODIFIER.green,
					LINEAR_MODIFIER.blue,
				];

			return [r, g, b].map(function(v, i) {
					return mod[i] * Math.pow(v/255.0, 2.4);
				})
				.reduce(function(t, v) {
					return t += v;
				}, 0);
		}
	}
	function getG() {
		return g;
	}
	function setG(n) {
		if (typeof n === 'string' && /[a-f]/i.test(n)) {
			g = strToNum(n);
		} else {
			g = Number(n);
		}
		
		var hsl = convertRgbToHsl({ red: r, green: g, blue: b });
		if (hsl) {
			h = hsl.hue;
			s = hsl.saturation;
			l = hsl.lightness;
		}
	}
	function getH() {
		return h;
	}
	function setH(n) {
		h = Number(n);
		h += (h < 360) ? 360 : 0;
		h %= 360;
		
		var rgb = convertHslToRgb({ hue: h, saturation: s, lightness: l, opacity: a });
		if (rgb) {
			r = rgb.red;
			g = rgb.green;
			b = rgb.blue;
		}
	}
	function getHColor() {
		function hex(n) {
			return `0${n.toString(16)}`.substr(-2);
		}

		if (isSet(this.red) && isSet(this.green) && isSet(this.blue)) {
			if (this.opacity < 1) {
				return `#${hex(this.red)}${hex(this.green)}${hex(this.blue)}${hex(Math.floor(this.opacity * 255))}`;
			}
			return `#${hex(this.red)}${hex(this.green)}${hex(this.blue)}`;
		}
	}
	function setHColor(n) {
		var rgb = convertHColorToRgb(n),
		    hsl = convertRgbToHsl(rgb);

		if (isSet(rgb.red) && isSet(rgb.green) && isSet(rgb.blue)) {
			r = rgb.red;
			g = rgb.green;
			b = rgb.blue;
			a = rgb.opacity;
		}
		if (isSet(hsl.hue) && isSet(hsl.saturation) && isSet(hsl.lightness)) {
			h = hsl.hue;
			s = hsl.saturation;
			l = hsl.lightness;
		}
	}
	function getL() {
		if (typeof l === 'number') {
			return `${Math.round(l * 100)}%`;
		}
	}
	function setL(n) {
		if (typeof n === 'string') {
			l = strToNum(n);
		} else {
			l = Number(n);
		}
		
		var rgb = convertHslToRgb({ hue: h, saturation: s, lightness: l, opacity: a });
		if (rgb) {
			r = rgb.red;
			g = rgb.green;
			b = rgb.blue;
		}
	}
	function getLinearModifier() {
		return LINEAR_MODIFIER;
	}
	function setLinearModifier(value) {
		if (isSet(value.red) && isSet(value.green) && isSet(value.blue)) {
			LINEAR_MODIFIER = value;
		}
	}
	function getLuminance() {
		function range(dec) {
			var n = dec / 255;

			return n < 0.03928
				? n / 12.92
				: Math.pow((n + 0.055) / 1.055, 2.4);
		}

		if (isSet(r) && isSet(g) && isSet(b)) {
			return (LINEAR_MODIFIER.red * range(r) +
				LINEAR_MODIFIER.green * range(g) +
				LINEAR_MODIFIER.blue * range(b)) * 100;
		}
	}
	function getName() {
		return colorName || getHColor().replace(/#/, '');
	}
	function setName(s) {
		if (s) {
			colorName = s;
		}
	}
	function getR() {
		return r;
	}
	function setR(n) {
		if (typeof n === 'string' && /[a-f]/i.test(n)) {
			r = strToNum(n);
		} else {
			r = Number(n);
		}
		
		var hsl = convertRgbToHsl({ red: r, green: g, blue: b });
		if (hsl) {
			h = hsl.hue;
			s = hsl.saturation;
			l = hsl.lightness;
		}
	}
	function getS() {
		if (typeof s === 'number') {
			return `${Math.round(s * 100)}%`;
		}
	}
	function setS(n) {
		if (typeof n === 'string') {
			s = strToNum(n);
		} else {
			s = Number(n);
		}
		
		var rgb = convertHslToRgb({ hue: h, saturation: s, lightness: l, opacity: a });
		if (rgb) {
			r = rgb.red;
			g = rgb.green;
			b = rgb.blue;
		}
	}

	// color format conversions
	/**
	 * @private
	 * @description Converts a hcolor string to an rgb object
	 * @returns {RGB}
	 * @param {HCOLOR} color
	 */
	function convertHColorToRgb(color) {
		var hd = color.value || color.hcolor || color;
		
		return REGEX.hex.map(function (r) {
			var m = r.exec('' + hd.trim());

			if (m) {
				var red = Math.min(255, Math.max(0, hexToDec((m[1] + m[1]).substr(-2)))),
				    green = Math.min(255, Math.max(0, hexToDec((m[2] + m[2]).substr(-2)))),
				    blue = Math.min(255, Math.max(0, hexToDec((m[3] + m[3]).substr(-2)))),
				    opacity = m[4] ? Math.min(1, Math.max(0, hexToDec((m[4] + m[4]).substr(-2)) / 255)) : 1;

				return { red, green, blue, opacity };
			}
		})
		.reduce(function (o, v) { return o || v; });
	}
	/**
	 * @private
	 * @description Converts an rgb string to an hsl object
	 * @returns {HSL}
	 * @param {String} hsl
	 */
	function convertHslStringToHsl(hsl) {
		return REGEX.hsl.map(function (regex) {
			var m = regex.exec(hsl);

			if (m) {
				return {
					hue: Number(m[1]),
					saturation: strToNum(m[2]),
					lightness: strToNum(m[3]),
					opacity: m[4] ? Number(m[4]): 1
				};
			}
		})
		.reduce(function (t, v) {
			return t || v;
		});    
	}
	/**
	 * @private
	 * @description Converts hue, saturation, and lightness to red, green, and blue values.
	 * @returns {RGB}
	 * @param {HSL} hsl
	 */
	function convertHslToRgb(hsl) {
		var C,
			hPrime,
			X,
			m,
			rgbPrime;

		if (isHSLString(hsl)) {
			hsl = convertHslStringToHsl(hsl);
		}
    
		/* if there is no saturation, the hue is gray with the specified lightness */
		if (hsl.saturation === 0) {
			return {
				red: hsl.lightness * 255,
				green: hsl.lightness * 255,
				blue: hsl.lightness * 255,
				opacity: hsl.opacity
			};
		} else if (typeof hsl.hue === 'number' && typeof hsl.saturation === 'number' && typeof hsl.lightness === 'number') {
			C = (1 - Math.abs(hsl.lightness * 2 - 1)) * hsl.saturation;
			hPrime = hsl.hue / 60;
			X = C * (1 - Math.abs((hPrime % 2) - 1));
			m = hsl.lightness - C / 2;
			rgbPrime = [
				[C, X, 0],
				[X, C, 0],
				[0, C, X],
				[0, X, C],
				[X, 0, C],
				[C, 0, X]
			][Math.floor(hPrime) % 6];
      
			return {
				red: Math.round((rgbPrime[0] + m) * 255),
				green: Math.round((rgbPrime[1] + m) * 255),
				blue: Math.round((rgbPrime[2] + m) * 255),
				opacity: hsl.opacity
			};
		}
	}
	/**
	 * @private
	 * @description Converts an rgb string to an hsl object
	 * @returns {HSL}
	 * @param {String} rgb
	 */
	function convertRgbStringToRgb(rgb) {
		return REGEX.rgb.map(function (regex) {
			var m = regex.exec(rgb);

			if (m) {
				return {
					red: Number(m[1]),
					green: Number(m[2]),
					blue: Number(m[3]),
					opacity: m[4] ? Number(m[4]): 1
				};
			}
		})
		.reduce(function (t, v) {
			return t || v;
		});
	}
	/**
	 * @private
	 * @description Converts red, green, and blue values to hue, saturation, and lightness
	 * @returns {HSL}
	 * @param {RGB} rgb
	 */
	function convertRgbToHsl(rgb) {
		var R,
			G,
			B,
			MAX,
			MIN,
			L,
			S,
			H = 60;

		if (isRGBString(rgb)) {
			rgb = convertRgbStringToRgb(rgb);
		}
    
		if (rgb && isSet(rgb.red) && isSet(rgb.green) && isSet(rgb.blue)) {
			R = round(rgb.red / 255);
			G = round(rgb.green / 255);
			B = round(rgb.blue / 255);
			MAX = Math.max(R, G, B);
			MIN = Math.min(R, G, B);
			L = (MAX + MIN) / 2;
			S = (MAX === MIN)
				? 0
				: L < 0.5
					? (MAX - MIN) / (MAX + MIN)
					: (MAX - MIN) / (2.0 - MAX - MIN || 1);

			/* convert hue to degrees on the color circle */
			if (R === MAX) {
				H *= ((G - B) / (MAX - MIN || 1));
			} else if (G === MAX) {
				H *= (2.0 + (B - R) / (MAX - MIN || 1));
			} else {
				H *= (4.0 + (R - G) / (MAX - MIN || 1));
			}

			H += H < 0 ? 360 : 0;

			return {
				hue: Math.round(H),
				saturation: Math.round(S * 100) / 100,
				lightness: Math.round(L * 100) / 100,
				opacity: rgb.opacity
			};
		}
	}
	
	// type checks
	/**
	 * @private
	 * @description Tests if something is a valid hexadecimal
	 * @returns {Boolean}
	 * @param {*} v
	 */
	function isHexadecimal(v) {
		return typeof v === 'string' &&
			REGEX.hex.map(function (r) {
				return r.test(v);
			})
			.filter(function (test) {
				return test;
			})
			.length > 0;
	}
	/**
	 * @private
	 * @description Tests if something is a valid HSL object
	 * @returns {Boolean}
	 * @param {*} v
	 */
	function isHSL(v) {
		return isHSLString(v) || v && isSet(v.hue) && isSet(v.saturation) && isSet(v.lightness);
	}
	/**
	 * @private
	 * @description Tests if something is a valid HSL string
	 * @returns {Boolean}
	 * @param {String} v
	 */
	function isHSLString(v) {
		return REGEX.hsl
			.map(function (regex) {
				return regex.test(v);
			})
			.filter(function (test) {
				return test;
			})
			.length > 0;
	}
	/**
	 * @private
	 * @description Tests if something is a valid RGB object
	 * @returns {Boolean}
	 * @param {*} v
	 */
	function isRGB(v) {
		return v && isSet(v.red) && isSet(v.green) && isSet(v.blue);
	}
	/**
	 * @private
	 * @description Tests if something is a rgb string
	 * @returns {Boolean}
	 * @param {String} v
	 */
	function isRGBString(v) {
		return REGEX.rgb
			.map(function (regex) {
				return regex.test(v);
			})
			.filter(function (test) {
				return test;
			}).length > 0;
	}
	/**
	 * @private
	 * @description Tests if something is a number
	 * @returns {Boolean}
	 * @param {*} v
	 */
	function isSet(v) {
		return !Number.isNaN(v) && typeof v !== 'undefined';
	}

	// maths functions
	/**
	 * @private
	 * @description Converts a hexadecimal string to a decimal number
	 * @return {Number}
	 * @param {String} hex
	 */
	function hexToDec(hex) {
		return parseInt(hex, 16);
	}
  	/**
	 * @private
	 * @description Rounds to two decimal places
	 * @return {Number|undefined}
	 * @param {Number} n
	 */
	function round(n) {
		return Number(n.toFixed(2));
	}
	/**
	 * @private
	 * @description Convert a percent string, a hexadecimal string, or a numeric string to a number.
	 * @returns {Number|undefined}
	 * @param {String|Number} n
	 */
	function strToNum(n) {
		if (typeof n === 'string' || typeof n === 'number') {
			if (/%$/.test(n)) {
				return parseFloat(n.replace(/%$/, '')) / 100;
			} else if (/^[0a-f]+$/i.test(n)) {
				return parseInt(n, 16);
			}
			return parseFloat(n);
		}
	}

	/**
	 * @private
	 * @description Normalizes an rgb value
	 * @returns {RGB}
	 * @param {RGB|HCOLOR|String} data
	 */
	function normalize(data) {
		if (!data) return;
		
		return isRGB(data)
			? data
			: isRGBString(data)
				? convertRgbStringToRgb(data)
				: isHSL(data)
					? convertHslToRgb(data)
					: convertHColorToRgb(data);
	}

	/**
	 * @private
	 * @description Initializes the values and sets corresponding variables.
	 * @returns {undefined}
	 * @param {HCOLOR|RGB|HSL} color
	 */
	function init(color) {
		var rgb = normalize(color),
		    hsl = convertRgbToHsl(rgb);

		if (rgb) {
			r = rgb.red;
			g = rgb.green;
			b = rgb.blue;
			a = rgb.opacity || strToNum(color.opacity);
		}
		if (hsl) {
			h = parseInt(hsl.hue, 10);
			h += h < 0 ? 360 : 0;
			s = strToNum(hsl.saturation);
			l = strToNum(hsl.lightness);
		}
		colorName = typeof color === 'object'
			? color.name || color.label || colorName
			: colorName;
	}

	var LINEAR_MODIFIER = {
		red: 0.2126,
		green: 0.7152,
		blue: 0.0722,
	},
	REGEX = {
		hex: [
			/^#?([0-9a-f]{1})([0-9a-f]{1})([0-9a-f]{1})$/i,
			/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i,
			/^#?([0-9a-f]{1})([0-9a-f]{1})([0-9a-f]{1})([0-9a-f]{1})?$/i,
			/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i,
		],
		rgb: [
			/^rgb\((\d+)\W+(\d+)\W+(\d+)\);?$/i,
			/^rgba\((\d+)\W+(\d+)\W+(\d+)\W*(\d?\.\d+)?\);?$/i,
		],
		hsl: [
			/^hsl\((\d+)\W+(\d+%)\W+(\d+%)\);?$/i,
			/^hsla?\((\d+)\W+(\d+%)\W+(\d+%)\W*(\d?\.\d+)?\);?$/i,
		]
	};

	var r, g, b,
	    h, s, l,
	    a,
	    colorName = cname;

	init(value);
};
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
function Luminance(foreground, background) {
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
/**
 * @class APCA
 * @author H Robert King <hrobertking@gmail.com>
 * @requires roking-a11y:Color
 * @description The `APCA` object allows for easy generation of a contrast ratio,
 * enabling comparison of two color definitions - `background` and `foreground`.
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
function APCA(f, b) {
	var bg, fg;

	// getters and setters
	function getBg() {
		return bg;
	}
	function setBg(value) {
		var v = value instanceof Color
      ? value
      : new Color(value);

		// use a finer grained modifier
		v.LINEAR_MODIFIER = {
			red: 0.2126729, //0.2126,
			green: 0.7151522, //0.7152,
			blue: 0.0721750, //0.0722,
		};

		bg = v.isColorType(value) ? v : bg;
		correctForOpacity();
	}
	function getFg() {
		return fg;
	}
	function setFg(value) {
		var v = value instanceof Color
      ? value
      : new Color(value);

		// use a finer grained modifier
		v.LINEAR_MODIFIER = {
			red: 0.2126729, //0.2126,
			green: 0.7151522, //0.7152,
			blue: 0.0721750, //0.0722,
		};

		fg = v.isColorType(value) ? v : fg;
		correctForOpacity();
	}

	/**
	 * @typedef Darkness
	 * @property {Number} threshold
	 * @property {Number} exponent
	 */
	var Darkness = {
		threshold: 0.022,
		exponent: 1.414,
	};

	/**
	 * @typedef Font
	 * @type {Object}
	 * @description Enumerated _ContrastMinimums_ and reporting methods.
	 * @property {ContrastMinimums} _Size_ Font size, e.g., 12px or 96px 
	 * @method {String[]} list Returns a list of all supported font sizes.
	 * @method {Node} toHtml Generates an HTMLNODE that is the minimum contrast score for various fonts with strong matches.
	 *
	 * @typedef ContrastMinimums
	 * @type {Number[]}
	 * @description Minimum APCA contrast score required for font weights 100..900 in 100 increments
	 */
	var Fonts = {
		'12px': [null,null,null,100,94,87,80,80,80],
	 	'14px': [null,null,null,90,84,77,70,70,70],
		'16px': [null,null,110,80,77,72,60,60,60],
 		'18px':[null,null,100,78,74,70,59,59,59],
		'20px':[null,120,94,76,72,67,58,58,58],
		'22px':[null,110,87,75,70,65,57,57,57],
 		'24px':[null,100,80,74,66,60,56,56,56],
		'26px':[null,96,78,72,65,59,55,55,55],
		'28px':[null,92,76,70,64,58,54,54,52],
		'30px':[null,88,74,68,62,57,53,52,50],
		'32px':[null,84,72,66,60,56,52,50,48],
		'36px':[120,80,70,64,58,54,50,48,46],
		'40px':[114,77,68,62,57,52,48,46,44],
		'44px':[108,74,66,60,55,50,46,44,42],
		'48px':[100,70,65,58,53,48,44,42,40],
		'56px':[95,67,64,56,51,46,42,40,40],
		'64px':[90,65,62,54,49,44,40,40,40],
		'72px':[85,63,60,52,47,42,40,40,40],
 		'96px':[80,60,55,50,45,40,40,40,40],
	};
	// methods are added using defineProperty so they are not enumerable
	Object.defineProperty(Fonts, 'list', {
		enumerable: false,
		value: function () {
			return Object.keys(this);
		},
	});
	Object.defineProperty(Fonts, 'toHtml', {
		enumerable: false,
		value: function () {
			var table = document.createElement('table'),
			    thead = document.createElement('thead'),
			    tbody = document.createElement('tbody'),
			    cols = Object.keys(this).reduce((count, key) => {
				    return Math.max(count, this[key].length);
			    }, 0),
			    h1 = thead.insertRow(),
			    cell = h1.appendChild(document.createElement('th')),
			    heading = 100,
			    apca = score();

			table.appendChild(thead);
			table.appendChild(tbody);

			cell.innerHTML = 'Font Size';
			for (var n = 0; n < cols; n += 1) {
				cell = h1.appendChild(document.createElement('th')),
				cell.innerHTML = heading;
				heading += 100;
			}

			Object.keys(this).forEach((key) => {
				var row = tbody.insertRow(),
				    vals = this[key];

				cell = row.insertCell();
				cell.innerHTML = key;

				for (var c = 0; c < vals.length; c += 1) {
					var v = Number(this[key][c]),
					    h = v <= Math.abs(apca) ? 'strong' : 'span',
					    n;

					cell = row.insertCell();
					n = cell.appendChild(document.createElement(h));
					n.innerHTML = this[key][c] || '⊘';
				}
			});

			return table;
		},
	});

	/**
	 * @typedef PowerCurveDetail
	 * @property {Number} PowerCurve
	 * @property {Number} PowerCurve.background
	 * @property {Number} PowerCurve.foreground
	 * @property {Number} PowerCurve.lowThreshold
	 * @property {Number} PowerCurve.lowFactor
	 * @property {Number} PowerCurve.lowOffset
	 *
	 * @typedef PowerCurve
	 * @property {PowerCurveDetail} normal
	 * @property {PowerCurveDetail} reverse
	 */
	 var PowerCurve = {
		normal: {
			background: 0.56,
			foreground: 0.57,
			lowThreshold: 0.035991,
			lowFactor: 27.7847239587675,
			lowOffset: 0.027,
		},
		reverse: {
			background: 0.62,
			foreground: 0.65,
			lowThreshold: 0.035991,
			lowFactor: 27.7847239587675,
			lowOffset: 0.027,
		}
	};
	
	var precision = 3;

	/**
	 * @private
	 * @description Adjust for opacity
	 */
	function correctForOpacity() {
		if (bg && fg && fg.opacity < 1) {
			var b = bg,
			    f = fg, 
			    a = f.opacity,
			    d = ['red', 'green', 'blue']
				.reduce(function (o, c) {
					o[c] = Math.round(a * f[c] + (1 - a) * b[c]);
					return o;
				}, { opacity: 1 });
			
			setFg(d);
		}    
	}

	/**
	 * @private
	 * @description Calculate the lightness of a color luminance to determine which is brighter for color polarity
	 * @return {Number}
	 * @param {Number} lum The luminance value for the color
	 */
	function lightness(lum) {
		if (lum > Darkness.threshold) {
			return lum;
		}
		return lum + Math.pow(Darkness.threshold - lum, Darkness.exponent);
	}

	/**
	 * @private
	 * @description Returns the luminance contrast ratio using the APCA method
	 * @see {@link https://w3c.github.io/silver/guidelines/methods/Method-font-characteristic-contrast.html}
	 * @return {Number}
	 */
	function score() {
    if (bg && fg) {
  		var back = bg.brightness,
	  	    fore = fg.brightness,
		      reverse = !(back > fore),
		      curve = PowerCurve.normal,
		      apca;

  		fore = reverse ? fore : lightness(fore);
	  	back = reverse ? lightness(back) : back;
 
  		curve = reverse
	  		? PowerCurve.reverse
		  	: PowerCurve.normal;
  		apca = (
	  		Math.pow(back, curve.background) - 
		  	Math.pow(fore, curve.foreground)
  		) * 1.14;

	  	return ((
		  	reverse
			  	? apca > -0.001
				  	? 0.0
					  : apca > -curve.lowThreshold
						  ? apca - apca * curve.lowFactor * curve.lowOffset
  						: apca + curve.lowOffset
	  			: apca < 0.001
		  			? 0.0
			  		: apca < curve.lowThreshold
				  		? apca - apca * curve.lowFactor * curve.lowOffset
					  	: apca - curve.lowOffset
  		) * 100).toFixed(precision);
    }
	};
  
	/**
	 * @property Darkness
	 * @type {Darkness}
	 */
	Object.defineProperty(this, 'Darkness', {
		enumerable: true,
		value: Darkness,
	});
  
	/**
	 * @property background
	 * @type {Color}
	 */
	Object.defineProperty(this, 'background', {
		enumerable: true,
		get: getBg,
		set: setBg,
	});
	
	/**
	 * @property Fonts
	 * @type {Font}
	 */
	Object.defineProperty(this, 'Fonts', {
		enumerable: true,
		value: Fonts,
	});
  
	/**
	 * @property foreground
	 * @type {Color}
	 */
	Object.defineProperty(this, 'foreground', {
		enumerable: true,
		get: getFg,
		set: setFg,
	});
  
	/**
	 * @property precision
	 * @type {Number}
	 * @default 3
	 */
	Object.defineProperty(this, 'precision', {
		enumerable: true,
		value: precision,
	});
  
	/**
	 * @property PowerCurve
	 * @type {PowerCurve}
	 */
	Object.defineProperty(this, 'PowerCurve', {
		enumerable: true,
		value: PowerCurve,
	});
  
	/**
	 * @method score
	 * @description Returns the luminance contrast ratio using the APCA method for the specified foreground and background.
	 * @return {Number}
	 */
	Object.defineProperty(this, 'score', {
		enumerable: false,
		value: score,
	});
  
	// initialize
	if (f && f.background) {
		setBg(f.background);
	} else {
		setBg(b);
	}

	if (f && f.foreground) {
		setFg(f.foreground);
	} else {
		setFg(f);
	}

	return this;
};
