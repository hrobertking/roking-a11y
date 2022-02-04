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
var Color = require('./color.js');  // eslint-disable-line global-require

module.exports = function APCA(foreground, background) {
	/**
	 * @typedef Darkness
	 * @property {Number} threshold
	 * @property {Number} exponent
	 */

	/**
	 * @property Darkness
	 * @type {Darkness}
	 */
	Object.defineProperty(this, 'Darkness', {
		enumerable: true,
		get: function () {
			return Darkness;
		},
	});
	
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
	 * @description Returns the luminance contrast ratio using the APCA method
	 * @see {@link https://w3c.github.io/silver/guidelines/methods/Method-font-characteristic-contrast.html}
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
	
	/**
	 * @property PowerCurve
	 * @type {PowerCurve}
	 */
	Object.defineProperty(this, 'PowerCurve', {
		enumerable: true,
		get: function () {
			return PowerCurve;
		},
	});
	
	/**
	 * @property precision
	 * @type {integer}
	 */
	Object.defineProperty(this, 'precision', {
		enumerable: true,
		value: 3,
		writeable: true,
	});

	/* getters and setters */
	function getBg() {
		return bg;
	}
	function setBg(color) {
		bg = color instanceof Color ? color : new Color(color);
		initBg = initBg || new Color(color);
	}
	function getContrast() {
		var back = this.background.luminance,
			fore = this.foreground.luminance,
			reverse = !(bg > fg);

		fore = reverse ? fore : lightness(fore);
		back = reverse ? lightness(back) : back;
 
		var curve = reverse ? this.PowerCurve.reverse : this.PowerCurve.normal,
			apca = (Math.pow(back, curve.background) - Math.pow(fore, curve.foreground)) * 1.14;

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
						? apca - apca * curve.lowFactor * curve.lowOoffset
						: apca - curve.lowOffset
		) * 100).toFixed(this.precision);
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
	 * @description Calculate the lightness of a color luminance to determine which is brighter for color polarity
	 * @returns {Number}
	 * @param {Number} lum The luminance value for the color
	 */
	function lightness(lum) {
		if (lum > Darkness.threshold) {
			return lum;
		}
		return lum + Math.pow(Darkness.threshold - lum, Darkness.exponent);
	}

	var PowerCurve = { // eslint-disable-line vars-on-top,
		normal: {
			background: 0.38,
			foreground: 0.43,
			lowThreshold: 0.035991,
			lowFactor: 27.7847239587675,
			lowOffset: 0.027,
		},
		reverse: {
			background: 0.5,
			foreground: 0.43,
			lowThreshold: 0.035991,
			lowFactor: 27.7847239587675,
			lowOffset: 0.027,
		},
	},
	Darkness = {
		threshold: 0.01,
		exponent: 1.5,
	};

	var bg, // eslint-disable-line vars-on-top,
		fg;

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
}
