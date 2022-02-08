/**
 * @class Color
 * @author H Robert King <hrobertking@gmail.com>
 * @description The `Color` object automatically converts between the three different color
 * specifications: a hexadecimal number, an object with `red`, `green`, and `blue` values, and an
 * object with `hue`, `saturation`, and `lightness` values and simplifies modification of the
 * values.
 * @param {hcolor|rgb|hsl} color
 *
 * @example
 * const color = new Color({ hue: 193, saturation: '67%', lightness: '28%' });
 * const color = new Color({ red: 24, green: 98, blue: 118 });
 * const color = new Color('#186276');
 * const color = new Color('#f0d');
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
module.exports = function Color(value) {
	/**
	 * @typedef RGB
	 * @property {Number} red - Tinyint value for red
	 * @property {Number} green - Tinyint value for green
	 * @property {Number} blue - Tinyint value for blue
	 * @property {Number} opacity - Percentage opaque
	 *
	 * @typedef HSL
	 * @property {Number} hue - Color wheel degree representation of hue
	 * @property {Number} saturation - Percentage of saturation
	 * @property {Number} lightness - Percentage of lightness
	 * @property {Number} opacity - Percentage opaque
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
	 * @property luminance
	 * @type {Number}
	 * @description A number 0..100 (inclusive) representing the luminance of a color.
	 * @see {@link https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef}
	 * @see {@link https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests}
	 */
	Object.defineProperty(this, 'luminance', {
		enumerable: true,
		get: getLuminance
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
		    	hsl = convertRgbTohsl(rgb);

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
		if (data) {
			return isHexadecimal(data) || isHSL(data) || isRGB(data);
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
	function getLuminance() {
		function range(dec) {
			var n = dec / 255;

			return n < 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
		}

		if (isSet(r) && isSet(g) && isSet(b)) {
			return (0.2126 * range(r) +
				0.7152 * range(g) +
				0.0722 * range(b)) * 100;
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
		return REGEX.hex.map(function (r) {
			var m = r.exec('' + color.trim());

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

		/* if there is no saturation, the hue is gray with the specified lightness */
		if (hsl.saturation === 0) {
			return {
				red: hsl.lightness * 255,
				green: hsl.lightness * 255,
				blue: hsl.lightness * 255,
				opacity: hsl.opacity
			};
		} else if (typeof hsl.hue === 'number' && typeof hsl.saturation === 'number' && typeof hsl.lightness === 'number') {
			C = (1 - Math.abs(hsl.lightness * 2 - 1)) * s;
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

		if (isSet(rgb.red) && isSet(rgb.green) && isSet(rgb.blue)) {
			R = round(rgb.red / 255);
			G = round(rgb.green / 255);
			B = round(rgb.blue / 255);
			MAX = Math.max(R, G, B);
			MIN = Math.min(R, G, B);
			L = (MAX + MIN) / 2;
			S = (MAX === MIN) ? 0 : L < 0.5 ? // eslint-disable-line no-nested-ternary
				(MAX - MIN) / (MAX + MIN) :
				(MAX - MIN) / (2.0 - MAX - MIN);

			/* convert hue to degrees on the color circle */
			if (R === MAX) {
				H *= ((G - B) / (MAX - MIN));
			} else if (G === MAX) {
				H *= (2.0 + (B - R) / (MAX - MIN));
			} else {
				H *= (4.0 + (R - G) / (MAX - MIN));
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
		return v && isSet(v.hue) && isSet(v.saturation) && isSet(v.lightness);
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
	 * @param {RGB|HCOLOR} data
	 */
	function normalize(data) {
		return isRGB(data) ? data :
			isHSL(data) ? convertHslToRgb(data) :
			convertHColorToRgb(data);
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
		}
		if (hsl) {
			h = parseInt(hsl.hue, 10);
			h += h < 0 ? 360 : 0;
			s = strToNum(hsl.saturation);
			l = strToNum(hsl.lightness);
		}
		a = rgb.opacity || strToNum(color.opacity);
	}

	var REGEX = {
		hex: [
			/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i,
			/^#([0-9a-f]{1})([0-9a-f]{1})([0-9a-f]{1})([0-9a-f]{1})?$/i,
		],
	};

	var r, g, b,
	    h, s, l,
	    a;

	init(value);
};
