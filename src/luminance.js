/**
 * @class Luminance
 * @author H Robert King <hrobertking@cathmhaol.com>
 * @requires roking-a11y:Color
 * @description The `Luminance` object allows for easy generation of a contrast ratio, enabling comparison of two color definitions - `background` and `foreground`. Additionally, the contrast ratio can be tested against a `threshold` object.
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
   * @method search
   * @description Modifies one or both Color properties to meet the specified level.
   * @returns {Luminance}
   * @param {number} level
   * @param {Color} isolate
   */
  this.search = function(level, isolate) {
    /*
     * if isolate is specified, only change the Color object specified in isolate,
     * else change _both_ Color properties: foreground and background.
     */
    var b = this.background, f = this.foreground;

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
        b[b.adjustProperty] && b.adjust();
        f[f.adjustProperty] && f.adjust();
      }
    }

    return this;
  };

  /**
   * @method test
   * @description Compares the contrast between the foreground and background to the specified level. 
   * @returns {boolean}
   * @param {number} level
   */
  this.test = function(level) {
    return !(this.contrast < level);
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

