# roking-a11y
Accessibility tools

## Color Tuner
The Color Tuner is a design tool that allows you to see, and select, accessible foreground and background colors by calculating and displaying the contrast ratio for colors as well as modifying foreground and background colors to meet accessibilityguidelines for luminance contrast (WCAG 2.1, Guideline 1.4, Success Criterion 1.4.3 and Success Criterion 1.4.6).

### Source
[Color Tuner Source](docs/color-tuner.htm)

### Example
[Color Tuner](https://hrobertking.github.io/roking-a11y/color-tuner.htm)

## Readability
The Readability utility calculates the Läsbarhetsindex for content.

> The current version of the `Readability` object does not account for phrases that are not complete sentences, so some measure of caution should be used. For example, the phrase "Last Name" would have a Läsbarhetsindex score of 2, but the the phrase "Surname" would have a Läsbarhetsindex score of 101, even though its complexity would not _ordinarily_ be consider that much greater. I am currently working to determine how best to accommodate this.

### Constructor
```
new Readability([**_string|string[]|HTMLElement|ConfigObject_ text**][, **_number_ size**][, **_string_** lang])
```

- text: content to evaluate
- size: length of a longword, defaults to 6 characters
- lang: a BCP-47 langtag or an ISO 639-1 language code.

### Internal Data Types
- **_ConfigObject_**: A configuration object
  - **_string_ lang**: A BCP-47 langtag or a ISO 639-1 language code.
  - **_number_ size**: The character length of a longword.
  - **_string|string[]|HTMLElement_ text**: The content to be parsed.

- **_ScoredItem_**: A scored phrase
  - **_number_ longwords**: The number of words with a length greater-than or equal-to `wlong`.
  - **_string_ phrase**: The phrase that has been evaluated.
  - **_number_ score**: The Läsbarhetsindex score for the phrase.
  - **_number_ sentences**: The number of sentences in the phrase.
  - **_number_ words**: The number of words in the phrase.

### Properties
- **_number_ avg**: The average Läsbarhetsindex for all parsed content. READ-ONLY
- **_string|string[]|HTMLElement_ content**: Raw content to be evaluated.
- **_string_ lang**: BCP-47 langtag or an ISO 639-1 language code for content.
- **_ScoredItem[]_ parsed**: Phrases parsed into scored items, set by setting content or passing content to the `score` method. READ-ONLY
- **number_ wlong**: The length, in characters, a word must be to be a long word. Defaults to 6 characters.

### Methods
- **_ScoredItem_ item(_number_ index)**: Returns a scored item from the `parsed` collection.
- **_number_ score([_string|string[]|HTMLElement_ content])**: Calculates and returns the Läsbarhetsindex for the specified content.

