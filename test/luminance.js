/* eslint func-names: 0, prefer-arrow-callback: 0, one-var: 0, quote-props: 0 */
const assert = require('assert');
const utilities = require('../src/index.js');

const Color = utilities.Color;
const Luminance = utilities.Luminance;
const WCAG = utilities.WCAG;

const matrix = {
	'000000': {
		'000000': '1.00',
		'0000ff': '2.44',
		'00ff00': '15.30',
		'00ffff': '16.75',
		'ff0000': '5.25',
		'ff00ff': '6.70',
		'ffff00': '19.56',
		'ffffff': '21.00',
	},
	'0000ff': {
		'000000': '2.44',
		'0000ff': '1.00',
		'00ff00': '6.26',
		'00ffff': '6.85',
		'ff0000': '2.15',
		'ff00ff': '2.74',
		'ffff00': '8.00',
		'ffffff': '8.59',
	},
	'00ff00': {
		'000000': '15.30',
		'0000ff': '6.26',
		'00ff00': '1.00',
		'00ffff': '1.09',
		'ff0000': '2.91',
		'ff00ff': '2.29',
		'ffff00': '1.28',
		'ffffff': '1.37',
	},
	'00ffff': {
		'000000': '16.75',
		'0000ff': '6.85',
		'00ff00': '1.09',
		'00ffff': '1.00',
		'ff0000': '3.19',
		'ff00ff': '2.50',
		'ffff00': '1.17',
		'ffffff': '1.25',
	},
	'ff0000': {
		'000000': '5.25',
		'0000ff': '2.15',
		'00ff00': '2.91',
		'00ffff': '3.19',
		'ff0000': '1.00',
		'ff00ff': '1.27',
		'ffff00': '3.72',
		'ffffff': '4.00',
	},
	'ff00ff': {
		'000000': '6.70',
		'0000ff': '2.74',
		'00ff00': '2.29',
		'00ffff': '2.50',
		'ff0000': '1.27',
		'ff00ff': '1.00',
		'ffff00': '2.92',
		'ffffff': '3.14',
	},
	'ffff00': {
		'000000': '19.56',
		'0000ff': '8.00',
		'00ff00': '1.28',
		'00ffff': '1.17',
		'ff0000': '3.72',
		'ff00ff': '2.92',
		'ffff00': '1.00',
		'ffffff': '1.07',
	},
	'ffffff': {
		'000000': '21.00',
		'0000ff': '8.59',
		'00ff00': '1.37',
		'00ffff': '1.25',
		'ff0000': '4.00',
		'ff00ff': '3.14',
		'ffff00': '1.07',
		'ffffff': '1.00',
	},
};

describe('utilities - Luminance', function () {
	it('constructs properly', function () {
		let lum = new Luminance();
		let udef;
		assert.equal(lum.foreground, udef);
		assert.equal(lum.background, udef);
		assert.equal(lum.contrast, udef);

		lum = new Luminance('#186276');
		assert.equal(lum.foreground.red, 24);
		assert.equal(lum.foreground.green, 98);
		assert.equal(lum.foreground.blue, 118);

		lum = new Luminance(null, '#186276');
		assert.equal(lum.foreground, udef);
		assert.equal(lum.background.red, 24);
		assert.equal(lum.background.green, 98);
		assert.equal(lum.background.blue, 118);

		lum = new Luminance('#186276', { red: 24, green: 98, blue: 118 });
		assert.equal(lum.foreground.red, 24);
		assert.equal(lum.foreground.green, 98);
		assert.equal(lum.foreground.blue, 118);
		assert.equal(lum.background.hcolor, '#186276');

		lum = new Luminance({ red: 24, green: 98, blue: 118 }, '#186276');
		assert.equal(lum.background.red, 24);
		assert.equal(lum.background.green, 98);
		assert.equal(lum.background.blue, 118);
		assert.equal(lum.foreground.hcolor, '#186276');

		lum = new Luminance({ foreground: { red: 24, green: 98, blue: 118 },
			background: '#186276' });
		assert.equal(lum.background.red, 24);
		assert.equal(lum.background.green, 98);
		assert.equal(lum.background.blue, 118);
		assert.equal(lum.foreground.hcolor, '#186276');
	});
	it('sets background correctly', function () {
		const lum = new Luminance();
		lum.background = '#186276';
		assert.equal(lum.background.red, 24);
		assert.equal(lum.background.green, 98);
		assert.equal(lum.background.blue, 118);
	});
	it('sets foreground correctly', function () {
		const lum = new Luminance();
		lum.foreground = '#186276';
		assert.equal(lum.foreground.red, 24);
		assert.equal(lum.foreground.green, 98);
		assert.equal(lum.foreground.blue, 118);
	});
	it('calculates contrast correctly for full opacity', function () {
		const lum = new Luminance('#fff', '#000');
		assert.equal(lum.contrast, 21);

		lum.background = '#fff';
		lum.foreground = '#000';
		assert.equal(lum.contrast, 21);

		lum.foreground = '#777';
		assert.equal(lum.contrast, 4.48);
	});
	it('calculates contrast correctly for partial opacity', function () {
		const lum = new Luminance('#fff6', '#000');
		assert.equal(lum.contrast, 3.66);

		lum.background = '#fff';
		lum.foreground = '#0006';
		assert.equal(lum.contrast, 2.85);

		lum.foreground = '#777';
		assert.equal(lum.contrast, 4.48);
	});
	it('tests using the specified threshold', function () {
		const lum = new Luminance('#000', '#fff');
		assert.equal(lum.test(WCAG.CONTRAST.AA.normal), true);
	});
	it('searches for a color value that passes a contrast threshold', function () {
		const lum = new Luminance('#ccc', '#bbb');

		// searches isolating changes to foreground only
		lum.search(WCAG.CONTRAST.AA.normal, lum.foreground);
		assert.equal(lum.foreground.hcolor, '#ffffff');
		assert.equal(lum.background.hcolor, '#bbbbbb');
		assert.equal(lum.test(WCAG.CONTRAST.AA.normal), false);

		// searches isolating changes to background only
		lum.reset();
		assert.equal(lum.background.hcolor, '#bbbbbb');
		assert.equal(lum.foreground.hcolor, '#cccccc');
	});
	it('searches for a color value that passes a contrast threshold', function () {
		const lum = new Luminance('#ccc', '#bbb');

		// searches isolating changes to foreground only
		lum.search(WCAG.CONTRAST.AA.normal, lum.foreground);
		assert.equal(lum.foreground.hcolor, '#ffffff');
		assert.equal(lum.background.hcolor, '#bbbbbb');
		assert.equal(lum.test(WCAG.CONTRAST.AA.normal), false);

		// searches isolating changes to background only
		lum.background = '#bbb';
		lum.foreground = '#ccc';
		lum.search(WCAG.CONTRAST.AA.normal, lum.background);
		assert.equal(lum.foreground.hcolor, '#cccccc');
		assert.equal(lum.background.hcolor, '#575757');
		assert.equal(lum.test(WCAG.CONTRAST.AA.normal), true);

		// searches without isolating changes
		lum.background = '#ccc';
		lum.foreground = '#bbb';
		lum.search(WCAG.CONTRAST.AA.normal);
		assert.equal(lum.background.hcolor, '#ffffff');
		assert.equal(lum.foreground.hcolor, '#767676');
		assert.equal(lum.test(WCAG.CONTRAST.AA.normal), true);

		lum.background = '#bbb';
		lum.foreground = '#ccc';
		lum.search(WCAG.CONTRAST.AA.normal);
		assert.equal(lum.foreground.hcolor, '#ffffff');
		assert.equal(lum.background.hcolor, '#767676');
		assert.equal(lum.test(WCAG.CONTRAST.AA.normal), true);

		lum.background = '#bbb';
		lum.foreground = '#cccc';
		lum.search(WCAG.CONTRAST.AA.normal);
		assert.equal(lum.foreground.hcolor, '#cdcb33cc');
		assert.equal(lum.background.hcolor, '#3f3f3f');
		assert.equal(lum.test(WCAG.CONTRAST.AA.normal), true);
	});
	it('constructs a table properly with a csv string', function () {
		const lum = new Luminance().matrix('#ffffff,#ffff00,#ff00ff,#ff0000,#00ffff,#00ff00,#0000ff,#000000');

		assert.deepEqual(lum, matrix);
	});
	it('constructs a table properly with color args', function () {
		const lum = new Luminance().matrix(
			new Color('#ffffff'),
			new Color('#ffff00'),
			new Color('#ff00ff'),
			new Color('#ff0000'),
			new Color('#00ffff'),
			new Color('#00ff00'),
			new Color('#0000ff'),
			new Color('#000000'),
		);

		assert.deepEqual(lum, matrix);
	});
	it('constructs a table properly with string args', function () {
		const lum = new Luminance().matrix(
			'#ffffff',
			'#ffff00',
			'#ff00ff',
			'#ff0000',
			'#00ffff',
			'#00ff00',
			'#0000ff',
			'#000000',
		);

		assert.deepEqual(lum, matrix);
	});
	it('constructs a table properly with a color array', function () {
		const lum = new Luminance().matrix([
			new Color('#ffffff'),
			new Color('#ffff00'),
			new Color('#ff00ff'),
			new Color('#ff0000'),
			new Color('#00ffff'),
			new Color('#00ff00'),
			new Color('#0000ff'),
			new Color('#000000'),
		]);

		assert.deepEqual(lum, matrix);
	});
	it('constructs a table properly with a mixed array', function () {
		const lum = new Luminance().matrix(
			new Color('#ffffff'),
			'#ffff00',
			new Color('#ff00ff'),
			'#ff0000',
			new Color('#00ffff'),
			'#00ff00',
			new Color('#0000ff'),
			'#000000',
		);

		assert.deepEqual(lum, matrix);
	});
	it('constructs a table properly with mixed args', function () {
		const lum = new Luminance().matrix(
			[
				new Color('#ffffff'),
				'#ffff00',
				new Color('#ff00ff'),
				'#ff0000',
				new Color('#00ffff'),
				'#00ff00',
			],
			new Color('#0000ff'),
			'#000000',
		);

		assert.deepEqual(lum, matrix);
	});
});
