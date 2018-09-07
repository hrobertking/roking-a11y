/**
 * @module roking-a11y
 * @author H Robert King <hrobertking@cathmhaol.com>
 * @description The readability utility calculates the Läsbarhetsindex for content.
 * @returns {number}
 * @param {string[]} content
 * @param {number} longWord
 */
export default function readability(content, longWord) {
  const wordLength = longWord || 5;
  
  let words = 0;
  let longWords = 0;
  let sentences = 0;
  
  for (let c = 0; c < content.length; c += 1) {
    const bites = content[c].split(' ');
    words += bites.length;
    longWords += bites.filter(word => word.length > wordLength).length;
    sentences += content[c].split(/[:.]/g).length;
  }
  
  return !words || !sentences ? 0 : Math.round(words/sentences) + ((longWords*100)/words));
}
