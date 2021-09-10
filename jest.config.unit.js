const defaultConfig = require( '@wordpress/scripts/config/jest-unit.config' );

module.exports = {
	...defaultConfig,
	rootDir: './',
	testMatch: [ '<rootDir>/resources/scripts/**/test/*.spec.js' ],
	collectCoverageFrom: [ '<rootDir>/resources/scripts/**/*.js' ],
};
