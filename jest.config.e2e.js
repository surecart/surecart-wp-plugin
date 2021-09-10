const defaultConfig = require( '@wordpress/scripts/config/jest-e2e.config' );

module.exports = {
	...defaultConfig,
	rootDir: './',
	testTimeout: 150000,
	testMatch: [ '<rootDir>/tests-e2e/**/*.spec.js' ],
	collectCoverageFrom: [ '<rootDir>/resources/scripts/**/*.js' ],
};
