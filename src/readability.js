/**
 * @module roking-a11y
 * @author H Robert King <hrobertking@cathmhaol.com>
 * @description The Readability utility calculates the Läsbarhetsindex for content.
 * @param {string|string[]|HTMLElement} content - content to evaluate
 * @param {number} wlen - length of a longword, defaults to 6 characters
 */
export default class Readability {
  constructor(content, wlen) {
    this.wlong = wlen || 6;
    this.content = content;
  }

  /**
   * @property avg
   * @type {number}
   * @description The average Läsbarhetsindex for parsed content.
   * @read-only
   */
  get avg() {
    if (this.parsed) {
      const sum = this.rawScores.reduce((ttl, num) => Number(num || 0) + Number(ttl || 0));
      return sum/this.rawScores.length;
    }
  }

  /**
   * @property content
   * @type {string|string[]|HTMLElement}
   * @description Raw content to be evaluated.
   */
  set content(data) {
    const isPrimitive = value => /^(boolean|number|string)$/.test(typeof value);
    const isElement = value => value && value.hasChildNodes;
    const isDocument = value => value && value.body;

    /* returns a string array given a primitive value or htmlelement */
    const normalize = (phrase) => {
      const els = [];
      const tags = isElement ? (phrase.body || phrase).getElementsByTagName('*') : null;
      if (isPrimitive(phrase)) {
        return [`${phrase}`];
      }
      if (tags) {
        for (let c = tags.length - 1; c > -1; c -= 1) {
          els.unshift(tags.item(c).textContent.replace(/\s+/, ' '));
        }
        return els;
      }
      return els[];
    };

    /* returns an object with word, longword, & sentence counts with score */
    const parse = (phrase) => {
      const bites = phrase.split(' ');
      const words = bites.length;
      const longWords = bites.filter(word => word.length >= this.wlong).length;
      const sentences = phrase.split(/[:.]/g).length;
      const score = !words || !sentences ? 0 : Math.round(words/sentences) + ((longWords*100)/words);

      return {
        longWords,
        phrase,
        score,
        sentences,
        words,
      };
    }

    this.parsed = Array.isArray(data) ?
      data.map(el => parse(el)) :
      normalize(data).map(el => parse(el));
  }

  /**
   * @property lang
   * @type {string}
   * @description BCP-47 langtag for content.
   */
  set lang(bcp47) {
    // TODO: override wlong for specified language
  }

  /**
   * @typedef {Object} ScoredItem
   * @description A scored phrase
   * @property {number} longwords
   * @property {string} phrase
   * @property {number} score
   * @property {number} sentences
   * @property {number} words
   */
  
  /**
   * @property parsed
   * @type {ScoredItem[]}
   * @description Phrases parsed into scored items.
   */

  /**
   * @property wlong
   * @type {number}
   * @description The length, in characters, a word must be to be a long word.
   * @default 6
   */

  /**
   * @method item
   * @description Returns a scored item.
   * @returns {ScoredItem}
   * @param {number} index
   */
  item(index) {
    return this.parsed ? this.parsed[index] : null;
  }

  /**
   * @method score
   * @description Calculates and returns the Läsbarhetsindex for the specified content.
   * @returns {number[]}
   * @param {string[]} content
   */
  score(content) {
    /* parse the content if it's passed in */
    if (content) {
      this.content = content;
    }

    return this;
  }
}
