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

module.exports = function APCA(f, b) {
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
