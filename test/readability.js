/* eslint func-names: 0, prefer-arrow-callback: 0, one-var: 0 */
const assert = require('assert');
const utilities = require('../src/index.js');

const Readability = utilities.Readability;

describe('utilities - Readability', function () {
  it('constructs correctly for different calls', function () {
    assert.equal((new Readability({ text: 'Drink this medicine, please. Thank you', lang: 'en' })).item(0).lix, 36);
    assert.equal((new Readability('Drink this medicine, please. Thank you.', 3, 'en')).wlong, 6);
    assert.equal((new Readability('Drink this medicine, please. Thank you.', 'en')).lang, 'en');
    assert.equal((new Readability('Drink this medicine, please. Thank you.', 3)).wlong, 3);
    assert.equal((new Readability('Drink this medicine, please. Thank you.')).LIX, 36);
  });
  it('calculates a zero score for missing content', function () {
    const evaluator = new Readability();
    assert.equal(evaluator.LIX, 0);
  });
  it('calculates a zero score and has an error if sample is too small', function () {
    const evaluator = new Readability({ text: 'Drink this medicine' });
    assert.equal(evaluator.LIX, 0);
    assert.notEqual(evaluator.error, undefined, `Error ${evaluator.error}`);
  });
  it('calculates the correct score for a string', function () {
    const content = 'Drink this medicine, please. Thank you.';
    const evaluator = new Readability(content);
    assert.equal(evaluator.LIX, 36);
  });
  it('calculates the correct score for a string array', function () {
    const content = [
      'Tomar este medicina, por favor. Gracias.',
      'Drink this medicine, please. Thank you.',
      'Now is the time for all good men to come to the aid of their country.',
    ];
    const evaluator = new Readability(content);
    assert.equal(evaluator.LIX, 31);
  });
  it('calculates the correct score for an HTML element', function () {
    const content = document.createElement('div');
    content.innerHTML = "<p>Tomar este medicina.</p><p>Drink this medicine.</p><p>Now is the time for all good men to come to the aid of their country.</p><p>I went to sleep with gum in my mouth and now there's gum in my hair and when I got out of bed this morning I tripped on my skateboard and by mistake I dropped my sweater in the sink while the water was running and I could tell it was going to be a terrible, horrible, no good, very bad day. I think I'll move to Australia.</p>";
    const evaluator = new Readability(content);
    assert.equal(evaluator.LIX, 18);
  });
  it('calculates the correct score for a multi-sentence phrase', function () {
    const content = "I went to sleep with gum in my mouth and now there's gum in my hair and when I got out of bed this morning I tripped on my skateboard and by mistake I dropped my sweater in the sink while the water was running and I could tell it was going to be a terrible, horrible, no good, very bad day. I think I'll move to Australia.";
    const evaluator = new Readability(content);
    assert.equal(evaluator.LIX, 50);
    assert.equal(evaluator.error, undefined, `Readability error: ${evaluator.error}`);
  });
  it('sets a new word length for a supported language', function () {
    const evaluator = new Readability();
    evaluator.lang = 'pl';
    assert.equal(evaluator.wlong, 7);
  });
  it('does not set a new word length for an unsupported language', function () {
    const evaluator = new Readability();
    evaluator.lang = 'zh';
    assert.equal(evaluator.wlong, 6);
  });
  it('does not set a new word length if the value is not a number', function () {
    const evaluator = new Readability();
    evaluator.wlong = 10;
    assert.equal(evaluator.wlong, 10);
    evaluator.wlong = 'foo';
    assert.equal(evaluator.wlong, 10);
  });
  it('sets the word length when provided a langtag', function () {
    const evaluator = new Readability(null, null, 'vi');
    assert.equal(evaluator.wlong, 5);
  });
  it('sets the language when provided a langtag', function () {
    const evaluator = new Readability(null, null, 'vi');
    assert.equal(evaluator.lang, 'vi');
  });
  it('sets values correctly when given a config object', function () {
    const lang = 'es';
    const size = 4;
    const text = 'Drink this medicine now, please.';

    assert.equal((new Readability({ lang, size, text })).lang, lang);
    assert.equal((new Readability({ lang, size })).lang, lang);
    assert.equal((new Readability({ lang, text })).lang, lang);
    assert.equal((new Readability({ size, text })).wlong, size);
    assert.equal((new Readability({ size, text })).LIX, 65);
  });
  it('sets content correctly when given content', function () {
    const content = 'Now is the time for all good men to come to the aid of their country';
    const evaluator = new Readability();
    assert.equal(evaluator.score(content).item(0).lix, 22);
  });
  it('scores correctly for blank content', function () {
    const evaluator = new Readability('');
    assert.equal(evaluator.LIX, 0);
  });
  it('returns itself when the score method is called', function () {
    const evaluator = new Readability();
    assert.equal(evaluator.score(), evaluator);
  });
  it('returns an array of languages supported', function () {
    const evaluator = new Readability();
    const languages = [
      { code: 'ar', name: 'Arabic' },
      { code: 'cs', name: 'Czech' },
      { code: 'da', name: 'Danish' },
      { code: 'de', name: 'German' },
      { code: 'el', name: 'Greek' },
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'et', name: 'Estonian' },
      { code: 'eu', name: 'Basque' },
      { code: 'fi', name: 'Finnish' },
      { code: 'fr', name: 'French' },
      { code: 'hr', name: 'Croatian' },
      { code: 'hu', name: 'Hungarian' },
      { code: 'is', name: 'Icelandic' },
      { code: 'it', name: 'Italian' },
      { code: 'lt', name: 'Lithuanian' },
      { code: 'lv', name: 'Latvian' },
      { code: 'nb', name: 'Norwegian Bokmål' },
      { code: 'nl', name: 'Dutch' },
      { code: 'nn', name: 'Norwegian Nynorsk' },
      { code: 'no', name: 'Norwegian' },
      { code: 'pl', name: 'Polish' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ro', name: 'Romanian' },
      { code: 'ru', name: 'Russian' },
      { code: 'sk', name: 'Slovak' },
      { code: 'sq', name: 'Albanian' },
      { code: 'sv', name: 'Swedish' },
      { code: 'tr', name: 'Turkish' },
      { code: 'uk', name: 'Ukrainian' },
      { code: 'vi', name: 'Vietnamese' },
    ];
    assert.equal(JSON.stringify(evaluator.languages), JSON.stringify(languages));
  });
});

