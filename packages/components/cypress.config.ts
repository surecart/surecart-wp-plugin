import { defineConfig } from 'cypress';

export default defineConfig({
  chromeWebSecurity: false,
  projectId: 'ae7zwm',
  experimentalWebKitSupport: true,
  e2e: {
    baseUrl: 'https://localhost:3456',
    specPattern: '**/*.cy.js',
  },
});
