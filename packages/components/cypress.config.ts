import { defineConfig } from 'cypress';

export default defineConfig({
  chromeWebSecurity: false,
  projectId: 'ae7zwm',
  e2e: {
    baseUrl: 'https://localhost:3456',
    specPattern: '**/*.cy.js',
  },
});
