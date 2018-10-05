/* eslint func-names: 0, prefer-arrow-callback: 0, one-var: 0 */
const assert = require('assert');
const utilities = require('../src/index.js');
const Readability = utilities.readability;

describe('utilities - readability', function () {
  it('calculates the correct score for a string', function () {
    const content = 'drink this medicine';
    const evaluator = new Readability(content);
    assert.equal(evaluator.avg, 36);
  });
  it('calculates the correct score for a string array', function () {
    const content = [
      'Tomar este medicina.',
      'Drink this medicine.',
      'Now is the time for all good men to come to the aid of their country.'
    ];
    const evaluator = new Readability(content);
    assert.equal(evaluator.avg, 31);
  });
  it('calculates the correct score for an HTML element', function () {
    const content = document.createElement('div');
    content.innerHTML = "<p>Tomar este medicina.</p><p>Drink this medicine.</p><p>Now is the time for all good men to come to the aid of their country.</p><p>I went to sleep with gum in my mouth and now there's gum in my hair and when I got out of bed this morning I tripped on my skateboard and by mistake I dropped my sweater in the sink while the water was running and I could tell it was going to be a terrible, horrible, no good, very bad day. I think I'll move to Australia.</p>";
    const evaluator = new Readability(content);
    assert.equal(evaluator.avg, 36);
  });
  it('calculates the correct score for a multi-sentence phrase', function () {
    const content = "I went to sleep with gum in my mouth and now there's gum in my hair and when I got out of bed this morning I tripped on my skateboard and by mistake I dropped my sweater in the sink while the water was running and I could tell it was going to be a terrible, horrible, no good, very bad day. I think I'll move to Australia.";
    const evaluator = new Readability(content);
    assert.equal(evaluator.avg, 50);
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
  it('returns an array of languages supported', function() {
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

