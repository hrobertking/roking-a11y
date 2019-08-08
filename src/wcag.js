/**
 * @class WCAG
 * @author H Robert King <hrobertking@cathmhaol.com>
 * @requires roking-a11y:Color
 * @description Constants defined by the WCAG
 *
 * @typedef compliance
 * @property {*} AA - normal and large thresholds for WCAG 2.1 AA compliance
 * @property {*} AAA - normal and large thresholds for WCAG 2.1 AAA compliance
 *
 * @typedef fontSize
 * @property {number} large - the contrast threshold for compliance for large-size text
 * @property {number} normal - the contrast threshold for compliance for normal-size text
 */
module.exports = {
	/**
	 * @property CONTRAST
	 * @type {compliance}
	 */
	CONTRAST: {
		/**
		 * @property CONTRAST.AA
		 * @type {fontSize}
		 */
		AA: {
			normal: 4.5,
			large: 3,
		},
		/**
		 * @property CONTRAST.AAA
		 * @type {fontSize}
		 */
		AAA: {
			normal: 7.1,
			large: 4.5,
		},
	},
};

