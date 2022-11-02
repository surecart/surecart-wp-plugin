describe('Checkout', () => {
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
      status: "finalized"
    }).as('finalize');

    cy.intercept({
			method: 'POST',
			path: '**/surecart/v1/checkouts/test/confirm*',
		}, {
      id: "test",
      status: "paid"
    }).as('confirm');
  });

	it('Can checkout', () => {
    cy.visit('/test/sc-checkout');

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

    cy.get('sc-order-submit sc-button').shadow()
    .find('.button')
    .should('not.have.class', 'button--loading')
    .click({ force: true, waitForAnimations: true, multiple: true });

    cy.wait('@finalize').its('request.url')
      .should('include', 'form_id=1')
      .should('include', 'processor_type=stripe');

    cy.location('pathname').should('contain', 'success');
    cy.location('search').should('contain', 'order=test');

		// // we will intercept confirm order.
		// cy.intercept({
		// 	method: 'POST',
		// 	path: '**surecart**checkouts*',
		// 	times: 1,
		// }).as('updateCheckout');
		// cy.intercept('POST', '**surecart**finalize*').as('finalizeOrder');
		// cy.intercept('POST', '**surecart**confirm*').as('confirmOrder');

		// cy.get('sc-order-submit sc-button')
		// 	.shadow()
		// 	.find('.button')
		// 	.should('not.have.class', 'button--loading')
		// 	.click({ force: true, waitForAnimations: true });

		// // update the order.
		// cy.wait('@updateCheckout', { timeout: 30000 }).then(
		// 	({ request, response }) => {
		// 		expect(request.body.email).to.eq('test@test.com');
		// 		expect(request.body.name).to.eq('John Doe');
		// 		expect(response.statusCode).to.eq(200);
		// 		expect(response.body.status).to.eq('draft');
		// 	}
		// );

		// // finalize the order.
		// cy.wait('@finalizeOrder', { timeout: 30000 }).then(({ response }) => {
		// 	expect(response.statusCode).to.eq(200);
		// 	expect(response.body.status).to.eq('finalized');
		// });

		// // confirm payment (and run automations)
		// cy.wait('@confirmOrder', { timeout: 30000 }).then(({ response }) => {
		// 	expect(response.statusCode).to.eq(200);
		// 	expect(response.body.status).to.eq('paid');
		// });

		// // thank you page.
		// cy.get('sc-order-confirmation', { timeout: 30000 }).should(
		// 	'be.visible'
		// );
	});

	// it('Can initiate checkout with PayPal', () => {
	// 	// choose paypal.
	// 	cy.get('.sc-paypal-toggle').shadow().find('.details').click();

	// 	// fill customer name and email
	// 	cy.get('sc-customer-name').invoke('attr', 'value', 'John Doe');
	// 	cy.get('sc-customer-email').invoke('attr', 'value', 'test@test.com');

	// 	cy.get('sc-paypal-buttons')
	// 		.shadow()
	// 		.find('.sc-paypal-button')
	// 		.should('be.visible');

	// 	cy.get('sc-paypal-buttons')
	// 		.find('iframe.visible')
	// 		.iframe()
	// 		.find('div[data-funding-source="paypal"]')
	// 		.last()
	// 		.click();

	// 	cy.intercept({
	// 		method: 'POST',
	// 		path: '**surecart**checkouts*',
	// 		times: 1,
	// 	}).as('updateCheckout');
	// 	cy.intercept('POST', '**surecart**finalize*').as('finalizeOrder');

	// 	// update the order.
	// 	cy.wait('@updateCheckout', { timeout: 30000 }).then(
	// 		({ request, response }) => {
	// 			expect(request.body.email).to.eq('test@test.com');
	// 			expect(request.body.name).to.eq('John Doe');
	// 			expect(response.statusCode).to.eq(200);
	// 			expect(response.body.status).to.eq('draft');
	// 		}
	// 	);

	// 	// finalize the order.
	// 	cy.wait('@finalizeOrder', { timeout: 30000 }).then(({ response }) => {
	// 		expect(response.statusCode).to.eq(200);
	// 		expect(response.body.status).to.eq('finalized');
	// 	});

	// 	// cy.paypalFlow('sb-3xe6d15890862@personal.example.com', 'P@pj0>v3');

	// 	// thank you page.
	// 	// cy.get('sc-order-confirmation', { timeout: 30000 }).should(
	// 	// 	'be.visible'
	// 	// );
	// });

	// it('Can checkout with a free product', () => {
	// 	cy.intercept({
	// 		method: 'POST',
	// 		path: '**surecart**checkouts*',
	// 		times: 1,
	// 	}, {
  //     id: "test"
  //   });

	// 	// wait for order to create.
	// 	cy.wait('@createCheckout');

	// 	// fill customer name and email
	// 	cy.get('sc-customer-name').invoke('attr', 'value', 'John Doe');
	// 	cy.get('sc-customer-email').invoke('attr', 'value', 'test@test.com');

	// 	// we will intercept confirm order.
	// 	cy.intercept({
	// 		method: 'POST',
	// 		path: '**surecart**checkouts*',
	// 		times: 1,
	// 	}).as('updateCheckout');
	// 	cy.intercept('POST', '**surecart**finalize*').as('finalizeOrder');
	// 	cy.intercept('POST', '**surecart**confirm*').as('confirmOrder');

	// 	cy.get('sc-order-submit sc-button')
	// 		.shadow()
	// 		.find('.button')
	// 		.should('not.have.class', 'button--loading')
	// 		.click({ force: true, waitForAnimations: true });

	// 	// update the order.
	// 	cy.wait('@updateCheckout', { timeout: 30000 }).then(
	// 		({ request, response }) => {
	// 			expect(request.body.email).to.eq('test@test.com');
	// 			expect(request.body.name).to.eq('John Doe');
	// 			expect(response.statusCode).to.eq(200);
	// 			expect(response.body.status).to.eq('draft');
	// 		}
	// 	);

	// 	// finalize the order.
	// 	cy.wait('@finalizeOrder', { timeout: 30000 }).then(({ response }) => {
	// 		expect(response.statusCode).to.eq(200);
	// 		expect(response.body.status).to.eq('paid');
	// 	});

	// 	// confirm payment (and run automations)
	// 	cy.wait('@confirmOrder', { timeout: 30000 }).then(({ response }) => {
	// 		expect(response.statusCode).to.eq(200);
	// 		expect(response.body.status).to.eq('paid');
	// 	});

	// 	// thank you page.
	// 	cy.get('sc-order-confirmation', { timeout: 30000 }).should(
	// 		'be.visible'
	// 	);
	// });
});
