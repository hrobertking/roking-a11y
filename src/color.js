/**
 * @module roking-a11y
 * @class Color
 *
 * @typedef {tinyint} A number between 0 and 255
 *
 * @typedef {hcolor} A 6-digit hexadecimal value with red in the first two digits, green in the
 * third and fourth digits, and blue in the fifth and sixth digits or a 3-digit hexadecimal value
 * with red in the first digit, green in the second digit, and blue in the third digit. If the
 * 3-digit length is used, the digits are expanded by repitition. For
 * example, if the value is 'ABC', the expanded value is 'AABBCC'.
 *
 * @typedef {rgb} An object with red, green, and blue values.
 * @property {tinyint} blue
 * @property {tinyint} green
 * @property {tinyint} red
 *
 * @typedef {hsl} An object with hue, luminance, and saturation.
 * @property {number} hue
 * @property {number} luminance
 * @property {number} saturation
 */
module.exports.default = function Color(value) {
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
   * @property luminance
   * @type {tinyint}
   */
  Object.defineProperty(this, 'luminance', {
    enumerable: true,
    get: getL,
    set: setL,
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

  /* getters and setters */
  function getB() {
    return b;
  }
  function setB(n) {
    if (/[a-f]+/.test(n)) {
      b = strToNum(n);
    } else {
      b = Number(n);
    }
    convertRgbToHsl();
  }
  function getG() {
    return g;
  }
  function setG() {
    if (/[a-f]+/.test(n)) {
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
    h = Number(n) + (n < 0 ? 360 : 0);
  }
  function getL() {
    return Math.round(l * 100)+'%';
  }
  function setL(n) {
    l = strToNum(n);
    convertHslToRgb();
  }
  function getR() {
    return r;
  }
  function setR() {
    if (/[a-f]+/.test(n)) {
      r = strToNum(n);
    } else {
      r = Number(n);
    }
    convertRgbToHsl();
  }
  function getS() {
    return Math.round(s * 100)+'%';
  }
  function setS(n) {
    s = strToNum(n);
    convertHslToRgb();
  }

  /**
   * @private
   * @description Converts a hcolor string to an rgb object
   * @returns {rgb}
   * @param {hcolor} color
   */
  function convertHColorToRgb(color) {
    var h6 = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(color),
      h3 = /^#?([0-9a-f]{1})([0-9a-f]{1})([0-9a-f]{1})$/i.exec(color),
      matched = (h6 || h3),
      R = matched ? (matched[1]+matched[1]).substr(-2) : null,
      G = matched ? (matched[2]+matched[2]).substr(-2) : null,
      B = matched ? (matched[3]+matched[3]).substr(-2) : null,
      rgb = {
        blue: parseInt(B, 16),
        green: parseInt(G, 16),
        red: parseInt(R, 16),
      };

    return rgb;
  }

  /**
   * @private
   * @description Converts hue, saturation, and luminance to red, green, and blue values, setting
   * internal variables r, g, and b.
   * @returns {undefined}
   */
  function convertHslToRgb() {
    var H = h / 360;

    /* normalizes values to be between 0 and 1 */
    function normalize(n) {
      if (n < 0) {
        return Math.floor((n + 1) * 1000) / 1000;
      } else if (n > 1) {
        return Math.floor((n - 1) * 1000) / 1000;
      }
      return Math.floor(n * 1000) / 1000;
    }

    /* performs color tests */
    function test(n) {
      var T1 = (l < .5) ? l * (1 + s) : l + s - l * s,
        T2 = 2 * l - T1;

      if (6 * n < 1) {
        return T2 + (T1 - T2) * 6 * n;
      } else if (2 * n < 1) {
        return T1;
      } else if (3 * n < 2) {
        return T2 + (T1 - T2) * (.666 - n) * 6;
      }
      return T2;
    }

    /* if there is no saturation, the hue is gray with the specified lightness */
    if (s == 0) {
      r = l * 255;
      g = l * 255;
      b = l * 255;
    } else {
      r = Math.round(test(normalize(H + .333)) * 255);
      g = Math.round(test(normalize(H)) * 255);
      b = Math.round(test(normalize(H - .333)) * 255);
    }
  }

  /**
   * @private
   * @description Converts red, green, and blue values to hue, saturation, and luminance,
   * setting internal values.
   * @returns {undefined}
   */
  function convertRgbToHsl() {
    if (!Number.isNaN(r) && !Number.isNaN(g) && !Number.isNaN(b)) {
      var R = round(r / 255),
        G = round(g / 255),
        B = round(b / 255),
        MAX = Math.max(R, G, B),
        MIN = Math.min(R, G, B),
        L = (MAX + MIN) / 2,
        S = (MAX == MIN) ? 0 : L < .5 ?
          (MAX - MIN)/(MAX + MIN) :
          (MAX - MIN)/(2.0 - MAX - MIN),
        H = 60;

      /* convert hue to degrees on the color circle */
      if (R == MAX) {
        H *= ((G - B) / (MAX - MIN));
      } else if (G == MAX) {
        H *= (2.0 + (B - R) / (MAX - MIN));
      } else if (B == MAX) {
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
   * @return {number}
   * @param {number} n
   */
  function round(n) {
    return Math.round(n * 100) / 100;
  }

  /**
   * @private
   * @description Convert a percent string, a hexadecimal string, or a numeric string to a number.
   * @returns {number}
   */
  function strToNum(n) {
    if (/%$/.test(n)) {
      return parseFloat(n.replace(/%$/, '')) / 100;
    } else if (/^[0-9a-f]+$/i.test(n)) {
      return parseInt(n, 16);
    }
    return parseFloat(n);
  }

  /**
   * @private
   * @description Initializes the values and sets corresponding variables.
   * @returns {undefined}
   * @param {hcolor|rgb|hsl} color
   */
  function init(color) {
    var rgb = convertHColorToRgb(color);

    r = isSet(rgb.red) ? rgb.red : color.red;
    g = isSet(rgb.green) ? rgb.green : color.green;
    b = isSet(rgb.blue) ? rgb.blue : color.blue;

    h = parseInt(color.hue, 10);
    s = strToNum(color.saturation);
    l = strToNum(color.lightness);

    h += h < 0 ? 360 : 0;

    if (isSet(r) && isSet(g) && isSet(b)) {
      convertRgbToHsl();
    } else if (isSet(h) && isSet(s) && isSet(l)) {
      convertHslToRgb();
    }
  }

  /**
   * internal variables for red, green, blue, hue, saturation, and luminance
   */
  var r, g, b, h, s, l;
  init(value);
};

