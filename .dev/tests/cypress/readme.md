# Integration Tests

**Powered by Cypress.io**

https://dashboard.cypress.io/#/projects/sovnn2/runs

Welcome to our end-to-end testing suite admin functionality. There are a number of helper methods inside of `.dev/tests/cypress/helpers.js` that make certain repetitive tasks easier (e.g. Adding a block a page, validating no errors exists in the editor window, opening a settings panel, etc.)

### If you are not using wp-env locally, you can add your own test credentials:
```bash
$ echo '{
  "baseUrl": "https://mysite.test",
  "wpUsername": "admin",
  "wpPassword": "password",
}' > cypress.env.json
```

### Open Cypress to run individual block tests
```bash
$ npm install
$ npx cypress open
```

### Run all block tests locally from the command line
```bash
$ npx cypress run --browser chrome --config video=false
```
