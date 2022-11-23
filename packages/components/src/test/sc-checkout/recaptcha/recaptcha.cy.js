describe('Recaptcha', () => {
  beforeEach(() => {
    cy.intercept({
			method: 'POST',
			path: '**/surecart/v1/checkouts/*',
		}, {
      id: "test",
      object: "checkout",
      status: "draft"
    }).as('createUpdate');

    cy.intercept({
			method: 'POST',
			path: '**/surecart/v1/checkouts/test/finalize*',
		}, {
      id: "test",
      object: "checkout",
      status: "draft"
    }).as('finalize');
  });

  it('Sends recaptcha data with request', async () => {

    cy.visit('/test/sc-checkout/recaptcha', {
      onBeforeLoad: window => {
        window.grecaptcha = {
          execute: cy.stub().as('executeRecaptcha').returns('testrecaptchahash')
        };
        window.scData = {
          recaptcha_site_key: 'test_key'
        }
      },
    });

    cy.wait('@createUpdate');
    cy.wait(500);

    // win is the remote window
    cy.get('sc-order-submit sc-button.hydrated').shadow().find('.button').should('not.have.class', 'button--loading').click({ force: true, waitForAnimations: true, multiple: true });

    cy.wait('@finalize').its('request.body').should('have.property', 'grecaptcha', 'testrecaptchahash')
  });
});
