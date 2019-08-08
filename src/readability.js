/**
 * @class Readability
 * @author H Robert King <hrobertking@cathmhaol.com>
 * @description The `Readability` utility calculates the Läsbarhetsindex for content.
 * @param {string|string[]|HTMLElement|ConfigObject} [text] - content to evaluate or a ConfigObject
 * @param {number} [size] - length of a longword, defaults to 6 characters
 * @param {string} [lang] - the BCP-47 langtag or language subtag for the content
 *
 * @example
 * const r = new Readability({ text: 'Drink this medicine', lang: 'en' });
 * const r = new Readability('Tomar este medicina', 'es');
 * const r = new Readability('Drink this medicine', 4);
 * const r = new Readability('Drink this medicine');
 *
 * @typedef {Object} ConfigObject
 * @description A configuration object
 * @property {string} lang
 * @property {number} size
 * @property {string|string[]|HTMLElement} text
 *
 * @typedef {Object} ScoredItem
 * @description A scored phrase
 * @property {number} longwords - the count of words exceeding normal length
 * @property {string} phrase - the content evaluated
 * @property {number} lix - the Läsbarhetsindex for the content
 * @property {number} ovix - the word variation index
 * @property {number} sentences - the number of sentences in the content
 * @property {number} words - the count of words in the content
 */
/* eslint-disable one-var, prefer-rest-params, vars-on-top */
module.exports = function Readability() {
	/**
	 * @property LIX
	 * @type {number}
	 * @description The average Läsbarhetsindex for parsed content.
	 * @read-only
	 */
	Object.defineProperty(this, 'LIX', {
		get: getAvgLix,
		enumerable: true,
	});

	/**
	 * @property OVIX
	 * @type {number}
	 * @description The average OVIX scores for parsed content.
	 * @read-only
	 */
	Object.defineProperty(this, 'OVIX', {
		get: getAvgOvix,
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
	Object.defineProperty(this, 'wlong', {
		get: getLong,
		set: setLong,
		enumerable: true,
		writeable: true,
	});

	/**
	 * @method item
	 * @description Returns a scored item.
	 * @returns {ScoredItem}
	 * @param {number} index
	 */
	this.item = function getItem(index) {
		return Me.parsed[index];
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
			Me.content = content;
		}

		return Me;
	};

	/**
	 * @private
	 * @description Returns the average score for all parsed content
	 * @returns {number}
	 */
	function getAvgLix() {
		var returnValue = 0,
			scores,
			sum;

		if (Me.parsed && Me.parsed.length) {
			scores = Me.parsed.map(si => si.lix);
			sum = scores.reduce((ttl, score) => ttl + score);

			returnValue = Math.round(sum / Me.parsed.length);
		}
		return returnValue;
	}

	/**
	 * @private
	 * @description Returns the average score for all parsed content
	 * @returns {number}
	 */
	function getAvgOvix() {
		var returnValue = 0,
			scores,
			sum;

		if (Me.parsed && Me.parsed.length) {
			scores = Me.parsed.map(si => si.ovix);
			sum = scores.reduce((ttl, score) => ttl + score);

			returnValue = Math.round(sum / Me.parsed.length);
		}
		return returnValue;
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
		return Object.keys(SIZES)
			.sort()
			.map(function mapLang(size) {
				return { code: size, name: SIZES[size].name };
			});
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
		var els = [],
			tags = isElement(phrase) ? (phrase.body || phrase).getElementsByTagName('*') : null,
			idx;

		if (isPrimitive(phrase)) {
			els.push(`${phrase}`);
		} else if (tags) {
			for (idx = tags.length - 1; idx > -1; idx -= 1) {
				els.unshift(tags.item(idx).textContent.replace(/\s+/, ' '));
			}
		}
		return els;
	}

	/**
	 * @private
	 * @description returns an object with word, longword, & sentence counts with score
	 * @returns {ScoredItem}
	 * @param {string} phrase
	 */
	function parse(phrase) {
		var bites = phrase.split(' '),
			words = bites.length,
			longWords = bites.filter(word => word.length > Me.wlong).length,
			sentences = phrase.split(/[:.]/g).filter(el => !!el).length,
			unique = bites.filter((v, i, a) => a.indexOf(v) === i).length,
			ovixNum = Math.log(words),
			ovixDenom = Math.log(2 - (Math.log(unique) / Math.log(words))),
			pcwords = 0,
			pclwords = 0,
			lix = 0,
			ovix = 0,
			wordCount,
			sentenceCount;

		// clear previous errors
		if (Me.error) {
			Me.error = null;
		}

		if (words && sentences && words > 4) {
			pcwords = words / sentences;
			pclwords = (longWords * 100) / words;
			lix = Math.round(pcwords + pclwords);
			ovix = Number((ovixDenom ? ovixNum / ovixDenom : 0).toFixed(2));
		} else {
			wordCount = `${words} word${words === 1 ? '' : 's'}`;
			sentenceCount = `${sentences} sentence${sentences === 1 ? '' : 's'}`;

			Me.error = new Error(`Sample size is too small: ${wordCount}, ${sentenceCount}`);
		}

		return {
			longWords,
			phrase,
			lix,
			ovix,
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
		Me.error = null;
		Me.parsed = Array.isArray(data) ?
			data.map(el => parse(el)) :
			normalize(data).map(el => parse(el));
	}

	/**
	 * @private
	 * @description Sets the wlong property based on the specified language.
	 * @returns {undefined}
	 */
	function setLang(bcp47) {
		/* get the language subtag */
		var langSubtag = (bcp47 || '').replace(ISO639_1, (match, lang) => lang);

		/* we can only set a new value if we have the language */
		if (Object.prototype.hasOwnProperty.call(SIZES, langSubtag)) {
			localLang = langSubtag;
			Me.wlong = Math.round(SIZES[langSubtag].value);
		}
	}

	/**
	 * @private
	 * @description Sets the longword size
	 * @returns {undefined}
	 * @param {number|string} n
	 */
	function setLong(n) {
		if (n && !Number.isNaN(parseInt(n, 10))) {
			localSize = parseInt(n, 10);
		}
	}

	/**
	 * @description The BCP-47 langtag pattern with a language subtag and a region subtag.
	 * @see {@link https://tools.ietf.org/html/bcp47}
	 */
	var ISO639_1 = /^([a-z]{2})(-[a-z]{2})?$/i;

	/**
	 * @description The average number of characters in one word, by ISO 639-2 language code.
	 * Data is based on research performed by Diuna and Kamila Marzęcka from SWPS University,
	 * and closely matches the number suggested by Carl-Hugo Björnsson.
	 * @see {@link https://en.wikipedia.org/wiki/Lix_(readability_test)}
	 * @see {@link https://diuna.biz/length-of-words-average-number-of-characters-in-a-word/}
	 */
	var SIZES = {
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

	// calculate the average word size across all languages
	var n = Object.keys(SIZES).map(el => SIZES[el].value).reduce((ttl, num) => ttl + num),
		i = Object.keys(SIZES).length,
		avgLength = n / i;

	// private variables
	var Me = this,
		localLang,
		localSize = 6,
		args = [].slice.call(arguments),
		config = args[0] || {},
		lang = config.lang || (ISO639_1.test(args[1]) ? args[1] : args[2]),
		size = config.size || (args[1] && !ISO639_1.test(args[1]) ? args[1] : null),
		text = config.text || args[0];

	this.wlong = size || Math.round(avgLength);
	this.lang = lang;
	this.content = text;
};

