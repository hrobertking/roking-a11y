# roking-a11y
Accessibility tools

## Readability
The Readability utility calculates the Läsbarhetsindex for content.

> The current version of the `Readability` object does not account for phrases that are not complete sentences, so some measure of caution should be used. For example, the phrase "Last Name" would have a Läsbarhetsindex score of 2, but the the phrase "Surname" would have a Läsbarhetsindex score of 101, even though its complexity would not _ordinarily_ be consider that much greater. I am currently working to determine how best to accommodate this.

### Constructor
```
new Readability([**_string|string[]|HTMLElement_ sample**][, **_number_ wlen**])
```

- sample: content to evaluate
- wlen: length of a longword, defaults to 6 characters

### Internal Objects
- **_ScoredItem_**: A scored phrase
  - **_number_ longwords**: The number of words with a length greater-than or equal-to `wlong`.
  - **_string_ phrase**: The phrase that has been evaluated.
  - **_number_ score**: The Läsbarhetsindex score for the phrase.
  - **_number_ sentences**: The number of sentences in the phrase.
  - **_number_ words**: The number of words in the phrase.

### Properties
- **_number_ avg**: The average Läsbarhetsindex for all parsed content. READ-ONLY
- **_string|string[]|HTMLElement_ content**: Raw content to be evaluated.
- **_string_ lang**: BCP-47 langtag for content.
- **_ScoredItem[]_ parsed**: Phrases parsed into scored items, set by setting content or passing content to the `score` method. READ-ONLY
- **number_ wlong**: The length, in characters, a word must be to be a long word. Defaults to 6 characters.

### Methods
- **_ScoredItem_ item(_number_ index)**: Returns a scored item from the `parsed` collection.
- **_number_ score([_string|string[]|HTMLElement_ content])**: Calculates and returns the Läsbarhetsindex for the specified content.

