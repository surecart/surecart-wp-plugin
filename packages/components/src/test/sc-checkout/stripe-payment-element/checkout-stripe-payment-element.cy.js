describe('Checkout Stripe', () => {
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
        email: 'test@test.com',
        amount_due: 1000,
        currency: 'usd',
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
        email: 'test@test.com',
        amount_due: 1000,
        currency: 'usd',
        payment_intent: {
          processor_type: 'stripe',
          external_intent_id: 'test',
          processor_data: {
            stripe: {
              client_secret: 'test',
              type: 'payment',
            },
          },
        },
      },
    ).as('finalize');

    cy.intercept(
      {
        method: 'POST',
        path: '**/surecart/v1/checkouts/test/confirm*',
      },
      {
        id: 'test',
        status: 'paid',
      },
    ).as('confirm');
  });

  it('Can checkout', () => {
    const confirmPayment = cy.stub().as('confirmPayment');
    cy.visit('/test/sc-checkout/stripe-payment-element/', {
      onBeforeLoad: window => {
        window.mockStripeMethods = {
          confirmPayment,
        };
      },
    });

    cy.wait('@createUpdate').then(({ request, response }) => {
      expect(request.url).to.include('stage_processor_type=stripe');
      expect(response.body.email).to.eq('test@test.com');
    });

    cy.get('sc-block-ui.busy-block-ui').should('not.exist');

    // fill stripe card element.
    cy.getStripePaymentElement('country', 'select').select('US');
    cy.getStripePaymentElement('number').type('4242424242424242', {
      force: true,
    });
    cy.getStripePaymentElement('expiry').type('430', { force: true });
    cy.getStripePaymentElement('cvc').type('123', { force: true });
    cy.getStripePaymentElement('postalCode').type('12345', {
      force: true,
    });

    // submit.
    cy.get('sc-order-submit sc-button').shadow().find('.button').should('not.have.class', 'button--loading').click({ force: true, waitForAnimations: true, multiple: true });

    cy.wait('@finalize').its('request.url').should('include', 'form_id=1').should('include', 'processor_type=stripe');

    cy.wait('@confirm');
    cy.get('@confirmPayment').should('have.been.calledOnce');
    cy.get('sc-dialog').find('sc-dashboard-module').should('be.visible');
    cy.get('sc-button').contains('Continue').should('be.visible').click();
    cy.get('sc-button[href]').should('have.attr', 'href').and('contain', 'success');
  });
});
