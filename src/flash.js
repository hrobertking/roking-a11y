/**
 * @class Flash
 * @author H Robert King
 * @requires roking-a11y:Color
 * @description The `Flash` object allows for easy determination of the type of flash if any exists.
 * @param {Color[]} colors
 *
 * @example
 * const f = new Flash([new Color('#000'), new Color('#fff')]);
 * const { general, red } = f.flash;
 * const { general, red } = f.test([new Color('#abcdef'), new Color('#ff3300')]);
 */
module.exports = function Flash(colors) {
  /**
	 * @property brightness
	 * @type {Float}
   * @description The maximum amount of brightness the colors can have in order to register a flash. Default is .8
	 */
	Object.defineProperty(this, 'brightness', {
		enumerable: true,
		get: getMaxBrightness,
    set: setMaxBrightness
	});

  /**
	 * @property delta
	 * @type {Float}
   * @description The minimum amount of luminance change from the brightest value in order to register a flash. Default is .1
	 */
	Object.defineProperty(this, 'delta', {
		enumerable: true,
		get: getMinDelta,
    set: setMinDelta
	});

  /**
	 * @property flash
	 * @type {Object}
   * @description Whether or not the last evaluated colors represent a general or red "flash".
   * @property {boolean} general
   * @property {boolean} red
	 */
	Object.defineProperty(this, 'flash', {
		enumerable: true,
		get: getFlash
	});

  /**
   * @method test
   * @returns {Object}
   * @property {boolean} general
   * @property {boolean} red
   * @description Returns whether or not the colors provided represent a general or red "flash"
   * @param {Color[]} colors
   */
  Object.defineProperty(this, 'test', {
    enumerable: true,
    value: init
  });

  function init(c) {
    setFlash();
    
    try {
  	  var lum = c.map(getLuminance), // eslint-disable-line vars-on-top
        saturation = c.map(getRed),
        maxLum = Math.max(...lum),
  		  minLum = Math.min(...lum),
        highR = Math.max(...saturation),
        lowR = Math.min(...saturation),
  	  	delta = maxLum - minLum,
        checkedRedDelta = redDelta && highR - lowR > redDelta;
    
      setFlash({
        general: minLum < maxBrightness && delta >= (maxLum * minDelta),
        red: c.some(getSaturated) && checkedRedDelta
      });

      return this.type;
    } catch (ignore) {
      throw new Error(`${ignore.message}`);
    }
  };

  function getFlash() {
    return result;
  }
  function getMaxBrightness() {
    return maxBrightness;
  }
  function getMinDelta() {
    return minDelta;
  }
  function setFlash(flash) {
    Object.keys(result).forEach(function (key) {
      result[key] = flash && flash.hasOwnProperty(key) ? flash[key] : null;
    });
  }
  function setMaxBrightness(num) {
    var value = Number(num);
    
    if (!Number.isNaN(value) && value >= 0 && value <= 1) {
      maxBrightness = value;
    }
  }
  function setMinDelta(num) {
    var value = Number(num);
    
    if (!Number.isNaN(value) && value >= 0 && value <= 1) {
      minDelta = value;
    }
  }
  
  function getLuminance(hue) {
    return hue.luminance / 100;
  }
  function getRed(hue) {
    return Math.max(0, hue.red - hue.green - hue.blue) * 320;
  }
  function getSaturated(hue) {
    return hue.saturatedRed;
  }

  var maxBrightness = .8, minDelta = .1, redDelta = 20,
      result = { general: null, red: null };
  
  init(colors);
  
  return this;
}
