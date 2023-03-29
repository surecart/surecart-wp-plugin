describe('Customer phone fields', () => {
  beforeEach(() => {
    cy.intercept(
      {
        method: 'POST',
        path: '**/surecart/v1/checkouts/test/finalize*',
      },
      {
        id: 'test',
        object: 'checkout',
        status: 'processing',
      },
    ).as('finalize');
  });

  it('Should not replace the exising value if checkout.customer.phone is returned', () => {
    cy.intercept(
      {
        method: 'POST',
        path: '**/surecart/v1/checkouts/*',
      },
      {
        id: 'test',
        object: 'customer',
        customer: { phone: '666666' },
      },
    ).as('createUpdate');

    cy.visit('/test/sc-checkout/phone-field/');

    cy.get('sc-form sc-customer-phone').shadow().find('sc-phone-input').invoke('attr', 'value', '111111');

    cy.wait('@createUpdate').then(() => {
      cy.get('sc-form sc-customer-phone').shadow().find('sc-phone-input').should('have.attr', 'value', '111111');
    });

    cy.get('sc-block-ui.busy-block-ui').should('not.exist');
    cy.get('sc-order-submit sc-button').shadow().find('.button').should('not.have.class', 'button--loading').click({ force: true, waitForAnimations: true, multiple: true });

    cy.wait('@finalize').then(({ request }) => {
      expect(request.body.phone).to.eq('111111');
    });
  });

  it('Should not replace the exising value if checkout.phone is returned', () => {
    cy.intercept(
      {
        method: 'POST',
        path: '**/surecart/v1/checkouts/*',
      },
      {
        id: 'test',
        object: 'checkout',
        phone: '666666',
      },
    ).as('createUpdate');

    cy.visit('/test/sc-checkout/phone-field/');

    cy.get('sc-form sc-customer-phone').shadow().find('sc-phone-input').invoke('attr', 'value', '111111');

    cy.wait('@createUpdate').then(() => {
      cy.get('sc-form sc-customer-phone').shadow().find('sc-phone-input').should('have.attr', 'value', '111111');
    });

    cy.get('sc-block-ui.busy-block-ui').should('not.exist');
    cy.get('sc-order-submit sc-button').shadow().find('.button').should('not.have.class', 'button--loading').click({ force: true, waitForAnimations: true, multiple: true });

    cy.wait('@finalize').then(({ request }) => {
      expect(request.body.phone).to.eq('111111');
    });
  });

  it('Should prefill if checkout.phone is returned', () => {
    cy.intercept(
      {
        method: 'POST',
        path: '**/surecart/v1/checkouts/*',
      },
      {
        id: 'test',
        object: 'checkout',
        phone: '666666',
      },
    ).as('createUpdate');

    cy.visit('/test/sc-checkout/phone-field/');

    cy.wait('@createUpdate').then(() => {
      cy.get('sc-form sc-customer-phone').shadow().find('sc-phone-input').should('have.attr', 'value', '666666');
    });

    cy.get('sc-block-ui.busy-block-ui').should('not.exist');
    cy.get('sc-order-submit sc-button').shadow().find('.button').should('not.have.class', 'button--loading').click({ force: true, waitForAnimations: true, multiple: true });

    cy.wait('@finalize').then(({ request }) => {
      expect(request.body.phone).to.eq('666666');
    });
  });

  it('Should prefill if checkout.customer.phone is returned', () => {
    cy.intercept(
      {
        method: 'POST',
        path: '**/surecart/v1/checkouts/*',
      },
      {
        id: 'test',
        object: 'customer',
        phone: '666666',
      },
    ).as('createUpdate');

    cy.visit('/test/sc-checkout/phone-field/');

    cy.wait('@createUpdate').then(() => {
      cy.get('sc-form sc-customer-phone').shadow().find('sc-phone-input').should('have.attr', 'value', '666666');
    });

    cy.get('sc-block-ui.busy-block-ui').should('not.exist');
    cy.get('sc-order-submit sc-button').shadow().find('.button').should('not.have.class', 'button--loading').click({ force: true, waitForAnimations: true, multiple: true });

    cy.wait('@finalize').then(({ request }) => {
      expect(request.body.phone).to.eq('666666');
    });
  });
});
