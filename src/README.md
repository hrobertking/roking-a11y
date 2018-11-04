# roking-a11y
Accessibility tools

## Color
The `Color` object automatically converts between the three different color specifications: a hexadecimal number, an object with `red`, `green`, and `blue` values, and an object with `hue`, `saturation`, and `lightness` values and simplifies modification of the values.

### Constructor
```
new Color([**_hcolor|rgb|hsl_**])
```

### Internal Data Types
- **_tinyint_**: A number between 0 and 255

- **_hcolor_**: A 6-digit hexadecimal string with red in the first two digits, green in the third and fourth digits, and blue in the fifth and sixth digits or a 3-digit hexadecimal string with red in the first digit, green in the second digit, and blue in the third digit. If the 3-digit length is used, the digits are expanded by repitition. For example, if the value is 'ABC', the expanded value is 'AABBCC'.

- **_rgb_**: An object with `red`, `green`, and `blue` values.
  - **_tinyint_ blue**
  - **_tinyint_ green**
  - **_tinyint_ red**

- **_hsl_**: An object with `hue`, `lightness`, and `saturation`.
  - **_number_|_string_** hue: The attribute of a visual sensation according to which an area appears to be similar to one of the perceived colors: red, yellow, green, and blue, or to a combination of two of them.
  - **_number_|_string_** lightness: The brightness relative to the brightness of a similarly illuminated white.
  - **_number_|_string_** saturation: The colorfulness of a stimulus relative to its own brightness.

### Properties
- **_tinyint_ blue**
- **_tinyint_ green**
- **_hcolor_ hcolor** The rgb value expressed as a 6-digit hexadecimal.
- **_number_ hue**: The attribute of a visual sensation according to which an area appears to be similar to one of the perceived colors: red, yellow, green, and blue, or to a combination of two of them.
- **_tinyint_ lightness**: The brightness relative to the brightness of a similarly illuminated white.
- **_number_ luminance**: A number between 0 and 100 (inclusive) representing the luminance of a color. The formulae used to determine luminance are those specified by the WCAG and can be found at https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef and https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-tests.
- **_tinyint_ red**
- **_number_ saturation**: The colorfulness of a stimulus relative to its own brightness.

### Methods
- **_Color_ darken([_integer_ amount])**: Darkens the color the specified amount, setting the color to black when color is undefined.
- **_Color_ lighten([_integer_ amount])**: Lightens the color the specified amount, setting the color to white when color is undefined.
- **_boolean_ isColorType(_any_ data)**: Returns true if the provided data is one of `hcolor`, `rgb`, or `hsl`.
- **_hcolor_ toString()**: Returns the current value of the `Color` as an `hcolor` string.


## Luminance
The `Luminance` object allows for easy generation of a contrast ratio, enabling comparison of two color definitions - `background` and `foreground`. Additionally, the contrast ratio can be tested against a `threshold` object.

### Constructor
```
new Luminance([**_Color|LuminanceConfig_** foreground[, **_Color_** background]])
```

### Internal Data Types
- **_LuminanceConfig_**: A configuration object
  - **_Color_ background**
  - **_Color_ foreground**

- **_compliance_**
  - **_threshold_ AA**: The `normal` and `large` thresholds for WCAG AA compliance
  - **_threshold_ AAA**: The `normal` and `large` thresholds for WCAG AAA compliance

- **_threshold_**
  - **_number_ large**: The contrast threshold for compliance for large-size text
  - **_number_ normal**: The contrast threshold for compliance for normal-size text

### Properties
- **_Color_ background**
- **_number_ contrast**: The luminance contrast ratio _n_:1 using the method identified by the WCAG at http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef
- **_Color_ foreground**
- **_compliance_ THRESHOLD**

### Methods
- **_boolean_ test(_threshold_)**: Returns true if the `contrast` is greater than or equal to the provided threshold


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

