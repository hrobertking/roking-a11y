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
exports.default = function Readability(sample, wlen) {
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
          Number(score || 0) + Number(ttl || 0);
        });
      return sum/self.parsed.length;
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
    const longWords = bites.filter(function countlong(word) { return word.length >= self.wlong; }).length;
    const sentences = phrase.split(/[:.]/g).length;
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
   * @description Sets the wlong property based on the specified language 
   * @returns {undefined}
   */
  function setLang(bcp47) {
    // TODO: override self.wlong default value based on specified language
  }

  const self = this;

  // constructor
  this.content = sample;
}
