const defaultConfig = require('@wordpress/scripts/config/jest-unit.config');

module.exports = {
	...defaultConfig,
	rootDir: './',
	testMatch: [
		'<rootDir>/(resouces/scripts|packages/blocks|packages/admin)/**/test/*.spec.js',
	],
	transformIgnorePatterns: [
		'node_modules/(?!(memize|@wordpress/i18n)/)',
	],
	collectCoverageFrom: ['<rootDir>/resources/scripts/**/*.js'],
};
