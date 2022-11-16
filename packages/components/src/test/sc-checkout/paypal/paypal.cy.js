describe('Checkout PayPal', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'POST',
        path: '**/surecart/v1/checkouts/*',
      },
      {
        id: 'test',
        object: 'checkout',
        status: 'draft',
      },
    ).as('createUpdate');

    cy.intercept(
      {
        path: '**/surecart/v1/checkouts/test/finalize*',
      },
      {
        id: 'test',
        object: 'checkout',
        status: 'finalized',
        payment_intent: {
          processor_type: 'paypal',
          external_intent_id: 'test',
        },
      },
    ).as('finalize');

    cy.intercept(
      {
        method: 'POST',
        path: '**/surecart/v1/checkouts/test/confirm/*',
      },
      {
        id: 'test',
        status: 'paid',
      },
    ).as('confirm');
  });


  it('Can checkout', () => {
    cy.visit('/test/sc-checkout/paypal/');

    cy.wait('@createUpdate');
    cy.get('sc-block-ui.busy-block-ui').should('not.exist');

    cy.get('sc-payment-method-choice[processor-id="paypal"]').shadow().find('sc-toggle').click();
    cy.get('sc-paypal-buttons').shadow().find('.sc-paypal-button').should('be.visible');

    // submit.
    cy.getPayPalButton('paypal').click({force: true, multiple: true});

    cy.wait('@finalize').its('request.url').should('include', 'form_id=1').should('include', 'processor_type=paypal');
  });
});
