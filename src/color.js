/**
 * @class Color
 * @author H Robert King <hrobertking@cathmhaol.com>
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
 * in the third and fourth digits, blue in the fifth and sixth digits, and the opacity in the seventh
 * and eighth digits (assumed to be ff), or a 3-digit or 4-digit hexadecimal string with red in the
 * first digit, green in the second digit, blue in the third digit, and the opacity in the fourth
 * digit. If the 3-digit or 4-digit length is used, the digits are expanded by repitition. For example, 
 * if the value is 'ABC' or 'ABCD', the expanded value is 'AABBCC' or 'AABBCCDD', respectively.
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
   * @property blue
   * @type {tinyint}
   */
  Object.defineProperty(this, 'blue', {
    enumerable: true,
    get: getB,
    set: setB,
    writeable: true,
  });

  /**
   * @property canDarken
   * @type {boolean}
   * @description A boolean representing a luminance greater than zero.
   */
  Object.defineProperty(this, 'canDarken', {
    enumerable: true,
    get: function canDarken() {
      return this.luminance > 0;
    },
  });

  /**
   * @property canLighten
   * @type {boolean}
   * @description A boolean representing a luminance less than one hundred
   */
  Object.defineProperty(this, 'canLighten', {
    enumerable: true,
    get: function canLighten() {
      return this.luminance < 100;
    },
  });

  /**
   * @property green
   * @type {tinyint}
   */
  Object.defineProperty(this, 'green', {
    enumerable: true,
    get: getG,
    set: setG,
    writeable: true,
  });

  /**
   * @property hcolor
   * @type {hcolor}
   * @description The hexadecimal color values as a 6-digit or 8-digit string
   */
  Object.defineProperty(this, 'hcolor', {
    enumerable: true,
    get: getHColor,
    set: setHColor,
    writeable: true,
  });

  /**
   * @property hue
   * @type {tinyint}
   */
  Object.defineProperty(this, 'hue', {
    enumerable: true,
    get: getH,
    set: setH,
    writeable: true,
  });

  /**
   * @property lightness
   * @type {tinyint}
   */
  Object.defineProperty(this, 'lightness', {
    enumerable: true,
    get: getL,
    set: setL,
    writeable: true,
  });

  /**
   * @property luminance
   * @type {number}
   * @description A number 0..100 (inclusive) representing the luminance of a color.
   * @see {@link https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef}
   * @see {@link https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests}
   */
  Object.defineProperty(this, 'luminance', {
    enumerable: true,
    get: getLuminance,
  });

  /**
   * @property opacity
   * @type {number}
   * @description A floating-point value representing the percentage of the background color blocked
   * @default 1
   */
  Object.defineProperty(this, 'opacity', {
    enumerable: true,
    get: getAlpha,
    set: setAlpha,
    writeable: true,
  });

  /**
   * @property red
   * @type {tinyint}
   */
  Object.defineProperty(this, 'red', {
    enumerable: true,
    get: getR,
    set: setR,
    writeable: true,
  });

  /**
   * @property saturation
   * @type {tinyint}
   */
  Object.defineProperty(this, 'saturation', {
    enumerable: true,
    get: getS,
    set: setS,
    writeable: true,
  });

  /**
   * @method darken
   * @description Darker the color.
   * @returns {Color}
   * @param {number} degree - how much darker the new value should be
   */
  this.darken = function darken(degree) {
    const color = this.toString() || '#000000';
    const n = parseInt(color.replace(/^#/, ''), 16);
    const R = Math.max(0, (n >> 16) - (degree || 1));
    const G = Math.max(0, (n & 0x0000FF) - (degree || 1));
    const B = Math.max(0, ((n >> 8) & 0x00FF) - (degree || 1));
    const h = (G | (B << 8) | (R << 16)).toString(16);
    const o = convertHColorToRgb(`000000${h}`.substr(-6));

    r = o.red;
    g = o.green;
    b = o.blue;
    convertRgbToHsl();

    return this;
  };

  /**
   * @method lighten
   * @description Lighten the color.
   * @returns {Color}
   * @param {number} degree - how much lighter the new value should be
   */
  this.lighten = function lighten(degree) {
    const color = this.toString() || '#ffffff';
    const n = parseInt(color.replace(/^#/, ''), 16);
    const R = Math.min((n >> 16) + (degree || 1), 255);
    const G = Math.min((n & 0x0000FF) + (degree || 1), 255);
    const B = Math.min(((n >> 8) & 0x00FF) + (degree || 1), 255);
    const h = (G | (B << 8) | (R << 16)).toString(16);
    const o = convertHColorToRgb(`000000${h}`.substr(-6));

    r = o.red;
    g = o.green;
    b = o.blue;
    convertRgbToHsl();

    return this;
  };

  /**
   * @method isColorType
   * @description Returns true if the provided data is one of `hcolor`, `rgb`, or `hsl`
   * @returns {boolean}
   * @param {*} data
   */
  this.isColorType = function isColorType(data) {
    if (data) {
      if (isSet(data.red) && isSet(data.green) && isSet(data.blue)) {
        return true;
      }
      if (isSet(data.hue) && isSet(data.saturation) && isSet(data.lightness)) {
        return true;
      }
      if (typeof data === 'string' && /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(data)) {
        return true;
      }
    }
    return false;
  };

  /**
   * @method toString
   * @description Returns a hexadecimal color string as used in CSS
   * @returns {string}
   */
  this.toString = function toString() {
    return this.hcolor;
  };

  /* getters and setters */
  function getAlpha() {
    return typeof a !== 'number' ? 1 : a;
  }
  function setAlpha(n) {
    // n may be a %, a hexadecimal, or digits
    var fp;

    if (typeof n === 'string' && /%/.test(n)) {
      fp = Number(n.replace(/%/g, '')) / 100;
    } else if (typeof n === 'string' && /^0|[a-f]/i.test(n)) {
      // if the number is a hexadecimal, the percentage is n divided by 255
      fp = parseInt(n, 16) / 255);
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
    convertRgbToHsl();
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
    convertRgbToHsl();
  }
  function getH() {
    return h;
  }
  function setH(n) {
    h = Number(n);
    h += (h < 360) ? 360 : 0;
    h %= 361;
  }
  function getHColor() {
    function hex(n) {
      return `0${n.toString(16)}`.substr(-2);
    }

    if (isSet(this.red) && isSet(this.green) && isSet(this.blue)) {
      if (this.opacity < 1) {
        return `#${hex(this.red)}${hex(this.green)}${hex(this.blue)}${hex(Math.round(this.opacity * 255))}`;
      }
      return `#${hex(this.red)}${hex(this.green)}${hex(this.blue)}`;
    }
    let udef;
    return udef;
  }
  function setHColor(n) {
    const rgb = convertHColorToRgb(n);

    if (isSet(rgb.red) && isSet(rgb.green) && isSet(rgb.blue)) {
      r = rgb.red;
      g = rgb.green;
      b = rgb.blue;
      a = rgb.opacity
      convertRgbToHsl();
    }
  }
  function getL() {
    return `${Math.round(l * 100)}%`;
  }
  function setL(n) {
    if (typeof n === 'string') {
      l = strToNum(n);
    } else {
      l = Number(n);
    }
    convertHslToRgb();
  }
  function getLuminance() {
    function range(dec) {
      const n = dec / 255;

      return n < 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
    }

    if (isSet(r) && isSet(g) && isSet(b)) {
      return (0.2126 * range(r) +
        0.7152 * range(g) +
        0.0722 * range(b)) * 100;
    }
    let udef;
    return udef;
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
    convertRgbToHsl();
  }
  function getS() {
    return `${Math.round(s * 100)}%`;
  }
  function setS(n) {
    if (typeof n === 'string') {
      s = strToNum(n);
    } else {
      s = Number(n);
    }
    convertHslToRgb();
  }

  /**
   * @private
   * @description Converts a hcolor string to an rgb object
   * @returns {rgb}
   * @param {hcolor} color
   */
  function convertHColorToRgb(color) {
    let R;
    let G;
    let B;
    let A;

    const h6 = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(color);
    const h3 = /^#?([0-9a-f]{1})([0-9a-f]{1})([0-9a-f]{1})$/i.exec(color);
    const matchS = (h6 || h3);
    
    const h8 = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(color);
    const h4 = /^#?([0-9a-f]{1})([0-9a-f]{1})([0-9a-f]{1})([0-9a-f]{1})$/i.exec(color);
    const matchL = (h8 || h4);
    
    if (matchS) {
      R = parseInt((matchS[1] + matchS[1]).substr(-2), 16);
      G = parseInt((matchS[2] + matchS[2]).substr(-2), 16);
      B = parseInt((matchS[3] + matchS[3]).substr(-2), 16);
    } else if (matchL) {
      R = parseInt((matchL[1] + matchL[1]).substr(-2), 16);
      G = parseInt((matchL[2] + matchL[2]).substr(-2), 16);
      B = parseInt((matchL[3] + matchL[3]).substr(-2), 16);
      A = parseInt((matchL[4] + matchL[4]).substr(-2), 16) / 255;
    }
    return { blue: B, green: G, red: R, opacity: A };
  }

  /**
   * @private
   * @description Converts hue, saturation, and lightness to red, green, and blue values, setting
   * internal variables r, g, and b.
   * @returns {undefined}
   */
  function convertHslToRgb() {
    /* normalizes values to be between 0 and 1 */
    function range(n) {
      if (n < 0) {
        return Math.floor((n + 1) * 1000) / 1000;
      } else if (n > 1) {
        return Math.floor((n - 1) * 1000) / 1000;
      }
      return Math.floor(n * 1000) / 1000;
    }

    /* performs color tests */
    function test(n) {
      const T1 = (l < 0.5) ? l * (1 + s) : l + s - l * s;
      const T2 = 2 * l - T1;

      if (6 * n < 1) {
        return T2 + (T1 - T2) * 6 * n;
      } else if (2 * n < 1) {
        return T1;
      } else if (3 * n < 2) {
        return T2 + (T1 - T2) * (0.666 - n) * 6;
      }
      return T2;
    }

    /* if there is no saturation, the hue is gray with the specified lightness */
    if (s === 0) {
      r = l * 255;
      g = l * 255;
      b = l * 255;
    } else {
      const H = h / 360;
      r = Math.round(test(range(H + 0.333)) * 255);
      g = Math.round(test(range(H)) * 255);
      b = Math.round(test(range(H - 0.333)) * 255);
    }
  }

  /**
   * @private
   * @description Converts red, green, and blue values to hue, saturation, and lightness
   * setting internal values.
   * @returns {undefined}
   */
  function convertRgbToHsl() {
    if (isSet(r) && isSet(g) && isSet(b)) {
      const R = round(r / 255);
      const G = round(g / 255);
      const B = round(b / 255);
      const MAX = Math.max(R, G, B);
      const MIN = Math.min(R, G, B);
      const L = (MAX + MIN) / 2;
      const S = (MAX === MIN) ? 0 : L < 0.5 ? // eslint-disable-line no-nested-ternary
        (MAX - MIN) / (MAX + MIN) :
        (MAX - MIN) / (2.0 - MAX - MIN);

      /* convert hue to degrees on the color circle */
      let H = 60;
      if (R === MAX) {
        H *= ((G - B) / (MAX - MIN));
      } else if (G === MAX) {
        H *= (2.0 + (B - R) / (MAX - MIN));
      } else {
        H *= (4.0 + (R - G) / (MAX - MIN));
      }

      H += H < 0 ? 360 : 0;

      h = Math.round(H);
      s = Math.round(S * 100) / 100;
      l = Math.round(L * 100) / 100;
    }
  }

  /**
   * @private
   * @description Tests if something is a number
   * @returns {boolean}
   * @param {*} v
   */
  function isSet(v) {
    return !Number.isNaN(v) && typeof v !== 'undefined';
  }

  /**
   * @private
   * @description Rounds to two decimal places
   * @return {number|undefined}
   * @param {number} n
   */
  function round(n) {
    if (typeof n === 'number') {
      return Number(n.toFixed(2));
    }
  }

  /**
   * @private
   * @description Convert a percent string, a hexadecimal string, or a numeric string to a number.
   * @returns {number|undefined}
   */
  function strToNum(n) {
    if (typeof n === 'string' || typeof n === 'number') {
      if (/%$/.test(n)) {
        return parseFloat(n.replace(/%$/, '')) / 100;
      } else if (/^[0-9a-f]+$/i.test(n)) {
        return parseInt(n, 16);
      }
      return parseFloat(n);
    }
  }

  /**
   * @private
   * @description Normalizes an rgb value
   * @returns {rgb}
   * @param {rgb|hcolor} data
   */
  function normalize(data) {
    if (data && isSet(data.red) && isSet(data.green) && isSet(data.blue)) {
      return data;
    }

    const rgb = convertHColorToRgb(data);
    if (!isSet(rgb.red) || !isSet(rgb.green) || !isSet(rgb.blue)) {
      let udef;
      return { red: udef, green: udef, blue: udef };
    }
    return rgb;
  }

  /**
   * @private
   * @description Initializes the values and sets corresponding variables.
   * @returns {undefined}
   * @param {hcolor|rgb|hsl} color
   */
  function init(color) {
    const rgb = normalize(color);

    if (color) {
      r = rgb.red;
      g = rgb.green;
      b = rgb.blue;
      a = rgb.opacity;

      h = parseInt(color.hue, 10);
      s = strToNum(color.saturation);
      l = strToNum(color.lightness);
      a = strToNum(color.opacity);

      h += h < 0 ? 360 : 0;

      if (isSet(r) && isSet(g) && isSet(b)) {
        convertRgbToHsl();
      } else if (isSet(h) && isSet(s) && isSet(l)) {
        convertHslToRgb();
      }
    }
  }

  /**
   * internal variables for red, green, blue, hue, saturation, lightness, and opacity
   */
  let r, g, b, h, s, l, a; // eslint-disable-line one-var, one-var-declaration-per-line
  init(value);
};
