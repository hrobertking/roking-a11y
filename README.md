# roking-a11y
Accessibility tools

## Readability
The Readability utility calculates the Läsbarhetsindex for content.

### Constructor
```
new Readability([**_string|string[]|HTMLElement_ sample**][, **_number_ wlen**])
```

- sample:
- wlen: length of a longword, defaults to 6 characters

### Internal Objects
- @typedef {Object} ScoredItem
- @description A scored phrase
- @property {number} longwords
- @property {string} phrase
- @property {number} score
- @property {number} sentences
- @property {number} words

### Properties
- **_number_ avg**: The average Läsbarhetsindex for all parsed content. READ-ONLY
- **_string|string[]|HTMLElement_ content**: Raw content to be evaluated.
- **_string_ lang**: BCP-47 langtag for content.
- **_ScoredItem[]_ parsed**: Phrases parsed into scored items, set by setting content or passing content to the `score` method. READ-ONLY
- **number_ wlong**: The length, in characters, a word must be to be a long word. Defaults to 6 characters.

### Methods
- **_ScoredItem_ item(_number_ index)**: Returns a scored item from the `parsed` collection.
- **_number_ score([_string|string[]|HTMLElement_ content])**: Calculates and returns the Läsbarhetsindex for the specified content.

