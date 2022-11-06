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
        staged_payment_intents: {
          data: [
            {processor_type: 'stripe',
            processor_data: {
              stripe: {
                account_id: "acct_1KgGVf2E2Wr9trjm",
                client_secret: "pi_3M0V4s2E2Wr9trjm1pRpX2oW_secret_lj5k8dgk8oJjaUxBXJQkFTr63",
                payment_method_id: null,
                publishable_key: "pk_test_51KeWoQFugiAKLuJycCZesY1aYEzfauqW2SHSZSUj5xCorx7h7oZd5i6Vz2whx7Y5fMZr6WQQTeOoQEtaEnpk4fkB00dinySlbK",
                type: "payment"
              }
            }
          }
          ]
        }
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
        staged_payment_intents: {
          data: [
            {processor_type: 'stripe',
            processor_data: {
              stripe: {
                account_id: "acct_1KgGVf2E2Wr9trjm",
                client_secret: "pi_3M0V4s2E2Wr9trjm1pRpX2oW_secret_lj5k8dgk8oJjaUxBXJQkFTr63",
                payment_method_id: null,
                publishable_key: "pk_test_51KeWoQFugiAKLuJycCZesY1aYEzfauqW2SHSZSUj5xCorx7h7oZd5i6Vz2whx7Y5fMZr6WQQTeOoQEtaEnpk4fkB00dinySlbK",
                type: "payment"
              }
            }
          }
          ]},
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
          confirmPayment
        };
      },
    });

    cy.wait('@createUpdate').then(({ request, response }) => {
      expect(request.url).to.include('stage_processor_type=stripe');
      expect(response.body.email).to.eq('test@test.com');
    })

    cy.get('sc-block-ui.busy-block-ui').should('not.exist');

    // fill stripe card element.
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
    cy.location('pathname').should('contain', 'success');
    cy.location('search').should('contain', 'order=test');
  });
});
