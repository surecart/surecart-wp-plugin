import { defineConfig } from 'cypress';

export default defineConfig({
  chromeWebSecurity: false,
  projectId: 'ae7zwm',
  experimentalWebKitSupport: true,
  retries: {
    // Configure retry attempts for `cypress run`
    // Default is 0
    runMode: 2,
    // Configure retry attempts for `cypress open`
    // Default is 0
    openMode: 0,
  },
  e2e: {
    baseUrl: 'http://localhost:3456',
    supportFile: 'cypress/support/support.ts',
    specPattern: '**/*.cy.js',
  },
});
