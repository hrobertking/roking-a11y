/**
 * @module roking-a11y
 * @class Luminance
 * @requires roking-a11y::Color
 *
 * @typedef compliance
 * @property {threshold} AA - normal and large thresholds for WCAG 2.1 AA compliance
 * @property {threshold} AAA - normal and large thresholds for WCAG 2.1 AAA compliance
 *
 * @typedef threshold
 * @property {number} normal - the contrast threshold for compliance for normal-size text
 * @property {number} large - the contrast threshold for compliance for large-size text
 */

module.exports = function Luminance(foreground, background) {
  /**
   * @property background
   * @type {Color}
   */
  Object.defineProperty(this, 'background', {
    enumerable: true,
    get: getBg,
    set: setBg,
    writeable: true,
  });

  /**
   * @property contrast
   * @type {number}
   * @description Returns the luminance contrast ratio n:1
   * @see {@link http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef}
   */
  Object.defineProperty(this, 'contrast', {
    enumerable: true,
    get: getContrast,
  });

  /**
   * @property foreground
   * @type {Color}
   */
  Object.defineProperty(this, 'foreground', {
    enumerable: true,
    get: getFg,
    set: setFg,
    writeable: true,
  });

  /**
   * @property THRESHOLD
   * @description Thresholds for luminance contrast for `AA` and `AAA`
   * @type {compliance}
   */
  this.THRESHOLD = {
    AA: {
      normal: 4.5,
      large: 3,
    },
    AAA: {
      normal: 7.1,
      large: 4.5,
    }
  };

  /**
   * @method test
   * @description Compares the contrast between the foreground and background to the provided threshold
   * @returns {boolean}
   * @param {threshold} t
   */
  this.test = function(t) {
    return !(this.contrast < t);
  };

  /* getters and setters */
  function getBg() {
    return bg;
  }
  function setBg(color) {
    bg = new Color(color);
  }
  function getContrast() {
    if (fg && bg) {
      var f = fg.luminance + 5,
        b = bg.luminance + 5,
        n = f / b;

      return f < b ? 1 / n : n;
    }
  }
  function getFg() {
    return fg;
  }
  function setFg(color) {
    fg = new Color(color);
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

  var Color = require('./color.js'),
    bg,
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
};

