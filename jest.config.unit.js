const defaultConfig = require( '@wordpress/scripts/config/jest-unit.config' );

module.exports = {
	...defaultConfig,
	rootDir: './',
	testMatch: [
		'<rootDir>/(resouces/scripts|packages/blocks)/**/test/*.spec.js',
	],
	collectCoverageFrom: [ '<rootDir>/resources/scripts/**/*.js' ],
};
