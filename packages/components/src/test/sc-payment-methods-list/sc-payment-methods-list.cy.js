const TEST_PAYMENT_METHODS = [
  {
    id: 'b7341ced-554b-4852-86be-735c83b88ff0',
    object: 'payment_method',
    external_payment_method_id: 'pm_1MZaBiBX0q9V2KAZlTNsOYIo',
    live_mode: false,
    processor_type: 'stripe',
    reusable: true,
    supported_currencies: null,
    type: 'card',
    bank_account: null,
    card: {
      id: '0cb52f58-8caf-476a-b3ed-b0ddfe0b2bbd',
      object: 'card',
      brand: 'amex',
      exp_month: 1,
      exp_year: 2024,
      last4: '0005',
      wallet_type: null,
      created_at: 1675949364,
      updated_at: 1675949364,
    },
    customer: {
      id: 'bc2dfd8c-ad3b-4ad8-acc9-36558cb97bd4',
      object: 'customer',
      billing_matches_shipping: true,
      email: 'test1@gmail.com',
      first_name: null,
      indexed: true,
      last_name: null,
      live_mode: false,
      name: null,
      phone: null,
      unsubscribed: false,
      billing_address: null,
      default_payment_method: 'b7341ced-554b-4852-86be-735c83b88ff0',
      shipping_address: '4c6e2c58-60c8-43aa-aa0d-8f75f4d48177',
      tax_identifier: null,
      created_at: 1675147424,
      updated_at: 1676007283,
    },
    payment_instrument: null,
    paypal_account: null,
    created_at: 1675949364,
    updated_at: 1676007283,
  },
  {
    id: 'cd2dc18a-7bb0-4318-bb6a-d7a1b52632e2',
    object: 'payment_method',
    external_payment_method_id: 'pm_1MZX9fBX0q9V2KAZuGL6tbdH',
    live_mode: false,
    processor_type: 'stripe',
    reusable: true,
    supported_currencies: null,
    type: 'card',
    bank_account: null,
    card: {
      id: '51b7759a-a7a7-44fd-8234-b2d3b3db32c6',
      object: 'card',
      brand: 'visa',
      exp_month: 4,
      exp_year: 2024,
      last4: '4242',
      wallet_type: null,
      created_at: 1675937706,
      updated_at: 1675937706,
    },
    customer: {
      id: 'bc2dfd8c-ad3b-4ad8-acc9-36558cb97bd4',
      object: 'customer',
      billing_matches_shipping: true,
      email: 'biikiptoo596@gmail.com',
      first_name: null,
      indexed: true,
      last_name: null,
      live_mode: false,
      name: null,
      phone: null,
      unsubscribed: false,
      billing_address: null,
      default_payment_method: 'b7341ced-554b-4852-86be-735c83b88ff0',
      shipping_address: '4c6e2c58-60c8-43aa-aa0d-8f75f4d48177',
      tax_identifier: null,
      created_at: 1675147424,
      updated_at: 1676006537,
    },
    payment_instrument: null,
    paypal_account: null,
    created_at: 1675937706,
    updated_at: 1676006537,
  },
];

describe('Payment Methods', () => {
  it('Shows an empty message', () => {
    cy.visit('/test/sc-payment-methods-list/');
    cy.get('sc-payment-methods-list').shadow().find('sc-empty').contains(`You don't have any saved payment methods.`);
  });

  it('Shows the list of payments', () => {
    cy.intercept(
      {
        path: '**/surecart/v1/payment_methods/*',
      },
      TEST_PAYMENT_METHODS,
    ).as('fetchPaymentMethods');

    cy.visit('/test/sc-payment-methods-list/');
    cy.wait('@fetchPaymentMethods');
    cy.get('sc-payment-method').first().contains('0005');
    cy.get('sc-payment-method').last().contains('4242');
  });

  it('Allows to view payment history', () => {
    cy.intercept(
      {
        path: '**/surecart/v1/payment_methods/*',
      },
      TEST_PAYMENT_METHODS,
    ).as('fetchPaymentMethods');
    cy.visit('/test/sc-payment-methods-list/');
    cy.wait('@fetchPaymentMethods');
    cy.get('sc-button').contains('Payment History').should('be.visible').find('a').click({
      force: true,
      waitForAnimations: true,
    });

    cy.url().should('contain', '/sc-payment-methods-list/?action=index&model=charge');
  });

  it('Allow adding a new payment method', () => {
    cy.intercept(
      {
        path: '**/surecart/v1/payment_methods/*',
      },
      TEST_PAYMENT_METHODS,
    ).as('fetchPaymentMethods');
    cy.visit('/test/sc-payment-methods-list/');
    cy.wait('@fetchPaymentMethods');
    cy.get('sc-button').contains('Add').should('be.visible').find('a').click({
      force: true,
      waitForAnimations: true,
    });

    cy.url().should('contain', '/sc-payment-methods-list/?action=create&model=payment_method');
  });

  it('Should mark payment as default', () => {
    cy.intercept(
      {
        path: '**/surecart/v1/payment_methods/*',
      },
      TEST_PAYMENT_METHODS,
    ).as('fetchPaymentMethods');
    cy.intercept(
      {
        path: '**/surecart/v1/customers/*',
      },
      {
        id: 'bc2dfd8c-ad3b-4ad8-acc9-36558cb97bd4',
        object: 'customer',
        billing_matches_shipping: true,
        email: 'test@gmail.com',
        first_name: null,
        indexed: true,
        last_name: null,
        live_mode: false,
        name: null,
        phone: null,
        unsubscribed: false,
        billing_address: null,
        default_payment_method: '341401c0-a3fb-46b6-88b1-77988f5a4d98',
        shipping_address: '4c6e2c58-60c8-43aa-aa0d-8f75f4d48177',
        tax_identifier: null,
        created_at: 1675147424,
        updated_at: 1676019013,
      },
    ).as('markDefault');
    cy.visit('/test/sc-payment-methods-list/');
    cy.wait('@fetchPaymentMethods');

    cy.get('sc-stacked-list-row').last().find('sc-tag').contains('Default').should('not.exist');
    cy.get('sc-stacked-list-row').last().find('sc-dropdown').click();
    cy.get('sc-menu').find('sc-menu-item').contains('Make Default').click();

    cy.get('sc-dialog')
      .find('sc-alert')
      .contains('A default payment method will be used as a fallback in case other payment methods get removed from a subscription.')
      .should('be.visible');

    cy.get('sc-dialog').find('sc-switch').contains('Update All Subscriptions').should('be.visible');

    cy.get('sc-button').contains('Make Default').click();
    cy.wait('@markDefault').then(({ request }) => {
      expect(request.body.default_payment_method).to.eq(TEST_PAYMENT_METHODS[1].id);
      expect(request.body.cascade_default_payment_method).to.eq(false);
    });

    cy.get('sc-stacked-list-row').last().find('sc-dropdown').click();
    cy.get('sc-menu').find('sc-menu-item').contains('Make Default').click();
    cy.get('sc-dialog sc-switch').find('label').click({ force: true });

    cy.get('sc-button').contains('Make Default').click();
    cy.wait('@markDefault').then(({ request }) => {
      expect(request.body.default_payment_method).to.eq(TEST_PAYMENT_METHODS[1].id);
      expect(request.body.cascade_default_payment_method).to.eq(true);
    });
  });
});
