/* eslint func-names: 0, prefer-arrow-callback: 0, one-var: 0, quote-props: 0 */
const assert = require('assert');
const utilities = require('../src/index.js');

const Color = utilities.Color;
const LuminanceMatrix = utilities.LuminanceMatrix;
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

describe('utilities - LuminanceMatrix', function () {
	it('constructs properly with a csv string', function () {
		const lum = new LuminanceMatrix('#ffffff,#ffff00,#ff00ff,#ff0000,#00ffff,#00ff00,#0000ff,#000000');

		assert.deepEqual(lum, matrix);
	});
	it('constructs property with color args', function () {
		const lum = new LuminanceMatrix(
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
	it('constructs property with string args', function () {
		const lum = new LuminanceMatrix(
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
	it('constructs property with a color array', function () {
		const lum = new LuminanceMatrix([
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
	it('constructs property with a mixed array', function () {
		const lum = new LuminanceMatrix(
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
	it('constructs property with mixed args', function () {
		const lum = new LuminanceMatrix(
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
