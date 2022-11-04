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
        path: '**/surecart/v1/checkouts/test/confirm/*',
      },
      {
        id: 'test',
        status: 'paid',
      },
    ).as('confirm');
  });

  it('Can checkout', () => {
    const confirmCardPaymentStub = cy.stub();
    cy.visit('/test/sc-checkout/stripe/', {
      onBeforeLoad: window => {
        window.mockStripeMethods = {
          confirmCardPayment: confirmCardPaymentStub,
        };
      },
    });

    cy.wait('@createUpdate');
    cy.get('sc-block-ui.busy-block-ui').should('not.exist');

    // fill stripe card element.
    cy.getStripeCardElement('number').type('4242424242424242', {
      force: true,
    });
    cy.getStripeCardElement('expiry').type('430', { force: true });
    cy.getStripeCardElement('cvc').type('123', { force: true });
    cy.getStripeCardElement('postalCode').type('12345', {
      force: true,
    });

    // submit.
    cy.get('sc-order-submit sc-button').shadow().find('.button').should('not.have.class', 'button--loading').click({ force: true, waitForAnimations: true, multiple: true });

    cy.wait('@finalize').its('request.url').should('include', 'form_id=1').should('include', 'processor_type=stripe');

    cy.location('pathname').should('contain', 'success');
    cy.location('search').should('contain', 'order=test');
  });
});
