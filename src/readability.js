/**
 * @module roking-a11y
 * @author H Robert King <hrobertking@cathmhaol.com>
 * @description The Readability utility calculates the Läsbarhetsindex for content.
 * @param {string|string[]|HTMLElement} [sample] - content to evaluate
 * @param {number} [wlen] - length of a longword, defaults to 6 characters
 * @param {string} [langtag] - the BCP-47 langtag or language subtag for the content
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
module.exports.default = function Readability(sample, wlen, langtag) {
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
    get: getLang,
    set: setLang,
    enumerable: true,
    writeable: true,
  });

  /**
   * @property languages
   * @type {object[]}
   * @description The `code` and `name` of languages supported
   */
  Object.defineProperty(this, 'languages', {
    get: getLangs,
    enumerable: true,
    writeable: false,
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
  //*
  Object.defineProperty(this, 'wlong', {
    get: getLong,
    set: setLong,
    enumerable: true,
    writeable: true,
  });
  // */

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
  };

  /**
   * @private
   * @description Returns the average score for all parsed content
   * @returns {number}
   */
  function getAvg() {
    if (self.parsed && self.parsed.length) {
      const scores = self.parsed.map(si => si.score);
      const sum = scores.reduce((ttl, score) => ttl + score);

      return Math.round(sum / self.parsed.length);
    }
    return 0;
  }

  /**
   * @private
   * @description Gets the language code.
   * @returns {string}
   */
  function getLang() {
    return localLang;
  }

  /**
   * @private
   * @description Gets the `code` and `name` of languages supported.
   * @returns {object[]}
   */
  function getLangs() {
    const langs = [];
    const keys = Object.keys(SIZES).sort();
    let i = keys.length - 1;
    while (i > -1) {
      const code = keys[i];
      const { name } = SIZES[code];
      langs.unshift({ code, name });
      i -= 1;
    }
    return langs;
  }

  /**
   * @private
   * @description Gets the longword size
   * @returns {number}
   */
  function getLong() {
    return localSize;
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
   * @description Returns a string array given a primitive value or htmlelement
   * @returns {string[]}
   * @param {*} phrase
   */
  function normalize(phrase) {
    const els = [];
    const tags = isElement(phrase) ? (phrase.body || phrase).getElementsByTagName('*') : null;

    if (isPrimitive(phrase)) {
      els.push(`${phrase}`);
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
    const longWords = bites.filter(word => word.length > self.wlong).length;
    const sentences = phrase.split(/[:.]/g).filter(el => !!el).length;
    const pcwords = words / (sentences || 1);
    const pclwords = (longWords * 100) / (words || 1);
    const score = !words || !sentences ? 0 : Math.round(pcwords + pclwords);

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

    /* get the language subtag */
    const langSubtag = (bcp47 || '').replace(ISO_PATTERN, (match, lang) => lang);

    /* we can only set a new value if we have the language */
    if (Object.prototype.hasOwnProperty.call(SIZES, langSubtag)) {
      localLang = langSubtag;
      self.wlong = Math.round(SIZES[langSubtag].value);
    }
  }

  /**
   * @private
   * @description Sets the longword size
   * @returns {undefined}
   * @param {number|string} n
   */
  function setLong(n) {
    if (n && !Number.isNaN(n)) {
      localSize = n;
    }
  }

  const self = this;

  /**
   * @description The average number of characters in one word, by ISO 639-2 language code.
   * Data is based on research performed by Diuna and Kamila Marzęcka from SWPS University,
   * and closely matches the number suggested by Carl-Hugo Björnsson.
   * @see {@link https://en.wikipedia.org/wiki/Lix_(readability_test)}
   * @see {@link https://diuna.biz/length-of-words-average-number-of-characters-in-a-word/}
   */
  const SIZES = {
    ar: { name: 'Arabic', l10n: 'العربية', value: 6.03 },
    cs: { name: 'Czech', l10n: 'Český', value: 6.02 },
    da: { name: 'Danish', l10n: 'Dansk', value: 5.48 },
    de: { name: 'German', l10n: 'Deutsch', value: 6.03 },
    el: { name: 'Greek', l10n: 'Ελληνικά', value: 6.47 },
    en: { name: 'English', l10n: 'English', value: 6.08 },
    es: { name: 'Spanish', l10n: 'Español', value: 5.71 },
    et: { name: 'Estonian', l10n: 'Eesti', value: 7.3 },
    eu: { name: 'Basque', l10n: 'Euskara', value: 6.51 },
    fi: { name: 'Finnish', l10n: 'Suomi', value: 7.55 },
    fr: { name: 'French', l10n: 'Français', value: 5.39 },
    hr: { name: 'Croatian', l10n: 'Hrvatski Jezik', value: 5.58 },
    hu: { name: 'Hungarian', l10n: 'Magyar', value: 6.48 },
    is: { name: 'Icelandic', l10n: 'Íslenska', value: 5.97 },
    it: { name: 'Italian', l10n: 'Italiano', value: 5.95 },
    lt: { name: 'Lithuanian', l10n: 'Lietuvių Kalba', value: 6.85 },
    lv: { name: 'Latvian', l10n: 'Latviešu Valoda', value: 7.14 },
    nb: { name: 'Norwegian Bokmål', l10n: 'Norsk Bokmål', value: 5.37 },
    nl: { name: 'Dutch', l10n: 'Nederlands', value: 6.48 },
    nn: { name: 'Norwegian Nynorsk', l10n: 'Norsk Nynorsk', value: 5.37 },
    no: { name: 'Norwegian', l10n: 'Norsk', value: 5.37 },
    pl: { name: 'Polish', l10n: 'Język Polski', value: 7.21 },
    pt: { name: 'Portuguese', l10n: 'Português', value: 5.66 },
    ro: { name: 'Romanian', l10n: 'Română', value: 6.49 },
    ru: { name: 'Russian', l10n: 'Русский', value: 6.06 },
    sk: { name: 'Slovak', l10n: 'Slovenčina', value: 6.35 },
    sq: { name: 'Albanian', l10n: 'Shqip', value: 6.35 },
    sv: { name: 'Swedish', l10n: 'Svenska', value: 5.97 },
    tr: { name: 'Turkish', l10n: 'Türkçe', value: 7.22 },
    uk: { name: 'Ukrainian', l10n: 'Українська', value: 7.52 },
    vi: { name: 'Vietnamese', l10n: 'Tiếng Việt', value: 4.5 },
  };

  // private variables
  let localLang;
  let localSize = 6;

  // constructor
  this.wlong = wlen;
  this.lang = langtag;
  this.content = sample;
};

