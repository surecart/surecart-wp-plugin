import { defineConfig } from 'cypress';

export default defineConfig({
	chromeWebSecurity: false,
	fixturesFolder: '.dev/tests/cypress/fixtures',
	screenshotsFolder: '.dev/tests/cypress/screenshots',
	viewportWidth: 2560,
	projectId: 'ae7zwm',
	viewportHeight: 1440,
	env: {
		testURL: 'http://localhost:8009',
		wpUsername: 'admin',
		wpPassword: 'password',
	},
	retries: {
		runMode: 0,
		openMode: 0,
	},
	pageLoadTimeout: 120000,
	e2e: {
		// We've imported your old cypress plugins here.
		// You may want to clean this up later by importing these.
		setupNodeEvents(on, config) {
			return require('./.dev/tests/cypress/plugins/index.js')(on, config);
		},
		baseUrl: 'http://localhost:8009',
		supportFile: '.dev/tests/cypress/support/commands.js',
		specPattern: './/.dev/tests/tests-e2e/**/*.cypress.js',
		excludeSpecPattern: '**/ignoredTestFiles/*.js',
	},
});
