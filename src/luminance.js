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
   * @description Returns the luminance contrast ratio n:1 with two-digit precision
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
    const b = this.background;
    const f = this.foreground;

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
    let f, b, n; // eslint-disable-line one-var, one-var-declaration-per-line
    if (fg && bg) {
      // compensate for any bleedthru from opacity
      f = new Color({
        red: (1 - fg.opacity) * bg.red + fg.opacity * fg.red,
        green: (1 - fg.opacity) * bg.green + fg.opacity * fg.green,
        blue: (1 - fg.opacity) * bg.blue + fg.opacity * fg.blue
      }).luminance + 5;
      b = bg.luminance + 5;
      n = f / b;

      // normalize for inverted background and foreground luminance
      n = f < b ? 1 / n : n;

      n = n.toFixed(2);
    }
    return n;
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
    const c = new Color();
    return c.isColorType(data);
  }

  const Color = require('./color.js'); // eslint-disable-line global-require
  let bg, fg; // eslint-disable-line one-var, one-var-declaration-per-line
  let initBg, initFg; // eslint-disable-line one-var, one-var-declaration-per-line

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

