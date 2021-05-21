const defaultConfig = require( '@wordpress/scripts/config/jest-unit.config' );

module.exports = {
	...defaultConfig,

	rootDir: '../../../',
	testMatch: [ '<rootDir>/resources/scripts/**/test/*.test.js' ],
	setupFilesAfterEnv: [ '<rootDir>/resources/tests/jest/setup-globals.js' ],
	reporters: [ 'default' ],
	collectCoverageFrom: [ '<rootDir>/resources/scripts/**/*.js' ],
};
