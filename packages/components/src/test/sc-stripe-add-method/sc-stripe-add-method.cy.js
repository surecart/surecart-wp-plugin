describe('Update Payment Method Stripe', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'POST',
        path: '**/surecart/v1/payment_intents*',
      },
      {"id":"5b306dfa-c850-4a63-be3d-553a934fb858","object":"payment_intent","amount":0,"currency":"usd","external_intent_id":"seti_1M1EXV2E2Wr9trjmZGg43pSM","live_mode":true,"off_session":false,"processor_data":{"stripe":{"account_id":"acct_1KgGVf2E2Wr9trjm","publishable_key":"pk_live_51KeWoQFugiAKLuJy2nsNMw3NihAirh8XCScAJCnPNNtfO31Hq9NXTBEhqDxFj4CjuXQLDmPaIyP9hCnGCNF8nSvb00k9a3p1GK","client_secret":"seti_1M1EXV2E2Wr9trjmZGg43pSM_secret_Mkk1cZzau0LsGCv5Ih7xeknuq1hfcOD","type":"setup","payment_method_id":null}},"processor_type":"stripe","reusable":true,"status":"pending","checkout":null,"customer":"424f5bd1-6ecc-4c17-9d14-38978ca91cfa","payment_method":null,"staged_checkout":null,"created_at":1667762993,"updated_at":1667762993,"customer_id":"424f5bd1-6ecc-4c17-9d14-38978ca91cfa"},
    ).as('createPaymentIntent');
  });

  it('Can update stripe payment method', () => {
    const confirmSetup = cy.stub().as('confirmSetup');
    cy.visit('/test/sc-stripe-add-method/', {
      onBeforeLoad: window => {
        window.mockStripeMethods = {
          confirmSetup
        };
      },
    });

    cy.wait('@createPaymentIntent').then(({request}) => {
      expect(request.body.customer_id).to.eq('customer_id');
      expect(request.body.live_mode).to.eq(false);
      expect(request.body.processor_type).to.eq('stripe');
    });

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
    cy.get('sc-button').shadow().find('.button').should('not.have.class', 'button--loading').click({ force: true, waitForAnimations: true, multiple: true });

    // Assert confirmSetup was called and we always redirect to the success url.
    cy.get('@confirmSetup').should('have.been.calledOnceWith', Cypress.sinon.match({
      confirmParams: {return_url: '/success'},
      redirect: 'always'
    }));
  });
});
