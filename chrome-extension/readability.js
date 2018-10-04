/**
 * @module roking-a11y
 * @author H Robert King <hrobertking@cathmhaol.com>
 * @description The Readability utility calculates the Läsbarhetsindex for content.
 * @param {string|string[]|HTMLElement} sample - content to evaluate
 * @param {number} wlen - length of a longword, defaults to 6 characters
 *
 * @typedef {Object} ScoredItem
 * @description A scored phrase
 * @property {number} longwords
 * @property {string} phrase
 * @property {number} score
 * @property {number} sentences
 * @property {number} words
 *
 */
function Readability(sample, wlen) {
  /**
   * @property avg
   * @type {number}
   * @description The average Läsbarhetsindex for parsed content.
   * @read-only
   */
	Object.defineProperty(this, 'avg', {
  	get: getAvg,
  	enumerable: true,
	});

  /**
   * @property content
   * @type {string|string[]|HTMLElement}
   * @description Raw content to be evaluated.
   */
  Object.defineProperty(this, 'content', {
    set: setContent,
    enumerable: true,
    writeable: true,
  });

  /**
   * @property lang
   * @type {string}
   * @description BCP-47 langtag for content.
   */
  Object.defineProperty(this, 'lang', {
    set: setLang,
    enumerable: true,
    writeable: true,
  });

  /**
   * @property parsed
   * @type {ScoredItem[]}
   * @description Phrases parsed into scored items. Set by setting content or passing content
   * to the `score` method.
   */

  /**
   * @property wlong
   * @type {number}
   * @description The length, in characters, a word must be to be a long word.
   * @default 6
   */
  this.wlong = wlen || 6;

  /**
   * @method item
   * @description Returns a scored item.
   * @returns {ScoredItem}
   * @param {number} index
   */
  this.item = function getItem(index) {
    return self.parsed ? self.parsed[index] : null;
  };

  /**
   * @method score
   * @description Calculates and returns the Läsbarhetsindex for the specified content.
   * @returns {number[]}
   * @param {string[]} content
   */
  this.score = function calculate(content) {
    /* parse the content if it's passed in */
    if (content) {
      self.content = content;
    }

    return self;
  }

  /**
   * @private
   * @description Returns the average score for all parsed content
   * @returns {number}
   */
  function getAvg() {
    if (self.parsed && self.parsed.length) {
      const scores = self.parsed.map(function mapScoredItem(si) {
          return si.score;
        });
      const sum = scores.reduce(function accumulate(ttl, score) {
          return ttl + score;
        });

      return Math.round(sum/self.parsed.length);
    }
  }

  /**
   * @private
   * @description Returns true if the type is primitive
   * @returns {boolean}
   * @param {*} value
   */
  function isPrimitive(value) {
    return /^(boolean|number|string)$/.test(typeof value);
  }

  /**
   * @private
   * @description Returns true if the object is an element with child nodes
   * @returns {boolean}
   * @param {*} value
   */
  function isElement(value) {
    return value && value.hasChildNodes;
  }

  /**
   * @private
   * @description Returns true if the type has a body
   * @returns {boolean}
   * @param {*} value
   */
  function isDocument(value) {
    return value && value.body;
  }

  /**
   * @private
   * @description Returns a string array given a primitive value or htmlelement
   * @returns {string[]}
   * @param {*} phrase
   */
  function normalize(phrase) {
    const els = [];
    const tags = isElement(phrase) ? (phrase.body || phrase).getElementsByTagName('*') : null;

    if (isPrimitive(phrase)) {
      els.push(phrase + '');
    } else if (tags) {
      for (let c = tags.length - 1; c > -1; c -= 1) {
        els.unshift(tags.item(c).textContent.replace(/\s+/, ' '));
      }
    }
    return els;
  }

  /**
   * @private
   * @description returns an object with word, longword, & sentence counts with score
   * @returns {object}
   * @param {string} phrase
   */
  function parse(phrase) {
    const bites = phrase.split(' ');
    const words = bites.length;
    const longWords = bites.filter(function countlong(word) { return word.length > self.wlong; }).length;
    const sentences = phrase.split(/[:.]/g).filter(function noblank(el) { return !!el; }).length;
    const score = !words || !sentences ? 0 : Math.round(words/sentences + (longWords*100)/words);

    return {
      longWords,
      phrase,
      score,
      sentences,
      words,
    };
  }

  /**
   * @private
   * @description Sets the parsed property using the provided content
   * @returns {undefined}
   */
  function setContent(data) {
    self.parsed = Array.isArray(data) ?
      data.map(el => parse(el)) :
      normalize(data).map(el => parse(el));
  }

  /**
   * @private
   * @description Sets the wlong property based on the specified language. 
   * @returns {undefined}
   */
  function setLang(bcp47) {
    /**
     * @description The BCP-47 langtag pattern with a language subtag and a region subtag.
     * @see {@link https://tools.ietf.org/html/bcp47}
     */
    const ISO_PATTERN = /^([a-z]{2})(-[a-z]{2})?$/i;

    /**
     * @description The average number of characters in one word, by ISO 639-2 language code.
     * Data is based on research performed by Diuna and Kamila Marzęcka from SWPS University,
     * and closely matches the number suggested by Carl-Hugo Björnsson.
     * @see {@link https://en.wikipedia.org/wiki/Lix_(readability_test)}
     * @see {@link https://diuna.biz/length-of-words-average-number-of-characters-in-a-word/}
     */
    const SIZES = {
      ar: 6.03,
      cs: 6.02,
      da: 5.48,
      de: 6.03,
      el: 6.47,
      en: 6.08,
      es: 5.71,
      et: 7.3,
      eu: 6.51,
      fi: 7.55,
      fr: 5.39,
      hr: 5.58,
      hu: 6.48,
      is: 5.97,
      it: 5.95,
      lt: 6.85,
      lv: 7.14,
      nb: 5.37,
      nl: 6.48,
      nn: 5.37,
      no: 5.37,
      pl: 7.21,
      pt: 5.66,
      ro: 6.49,
      ru: 6.06,
      sk: 6.35,
      sq: 6.35,
      sv: 5.97,
      tr: 7.22,
      uk: 7.52,
      vi: 4.5,
    };

    /* get the language subtag */
    const langSubtag = (bcp47 || '').replace(ISO_PATTERN, function(match, lang, region) {
      return lang;
    });
    
    /* we can only set a new value if we have the language */
    if (Object.prototype.hasOwnProperty.call(SIZES, langSubtag)) {
      self.wlong = Math.round(SIZES[langSubtag]);
    }
  }
	
  const self = this;

  // constructor
  this.content = sample;
}
