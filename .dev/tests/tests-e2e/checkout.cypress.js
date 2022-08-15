describe('Checkout', () => {
	beforeEach(() => {
		let checkoutPageId, priceId;
		cy.intercept({
			method: 'POST',
			path: '**surecart**checkout*',
			times: 1,
		}).as('createCheckout');

		// get the checkout page id.
		cy.exec(
			`yarn wp-env run tests-cli "wp option get surecart_checkout_page_id"`
		).then((response) => {
			checkoutPageId = response.stdout;

			cy.clearLocalStorage();

			// create price for these tests.
			cy.surecartRequest({
				path: 'products?expand[]=prices',
				method: 'POST',
				body: {
					product: {
						name: 'Test Product',
						prices: [
							{
								amount: 900,
							},
						],
					},
				},
			}).then((response) => {
				expect(response.body.prices.data[0].id).to.be.a('string');
				priceId = response.body.prices.data[0].id;

				// buy button link
				cy.visit(
					`?p=${parseInt(
						checkoutPageId
					)}&line_items[0][price_id]=${priceId}`
				);
			});
		});
	});

	it('Can checkout', () => {
		// fill customer name and email
		cy.get('sc-customer-name').invoke('attr', 'value', 'John Doe');
		cy.get('sc-customer-email').invoke('attr', 'value', 'test@test.com');

		// fill stripe card element.
		cy.getStripeCardElement('number').type('4242424242424242', {
			force: true,
		});
		cy.getStripeCardElement('expiry').type('430', { force: true });
		cy.getStripeCardElement('cvc').type('123', { force: true });
		cy.getStripeCardElement('postalCode').type('12345', {
			force: true,
		});

		// we will intercept confirm order.
		cy.intercept({
			method: 'POST',
			path: '**surecart**checkouts*',
			times: 1,
		}).as('updateCheckout');
		cy.intercept('POST', '**surecart**finalize*').as('finalizeOrder');
		cy.intercept('POST', '**surecart**confirm*').as('confirmOrder');

		cy.get('sc-order-submit sc-button')
			.shadow()
			.find('.button')
			.should('not.have.class', 'button--loading')
			.click({ force: true, waitForAnimations: true });

		// update the order.
		cy.wait('@updateCheckout', { timeout: 30000 }).then(
			({ request, response }) => {
				expect(request.body.email).to.eq('test@test.com');
				expect(request.body.name).to.eq('John Doe');
				expect(response.statusCode).to.eq(200);
				expect(response.body.status).to.eq('draft');
			}
		);

		// finalize the order.
		cy.wait('@finalizeOrder', { timeout: 30000 }).then(({ response }) => {
			expect(response.statusCode).to.eq(200);
			expect(response.body.status).to.eq('finalized');
		});

		// confirm payment (and run automations)
		cy.wait('@confirmOrder', { timeout: 30000 }).then(({ response }) => {
			expect(response.statusCode).to.eq(200);
			expect(response.body.status).to.eq('paid');
		});

		// thank you page.
		cy.get('sc-order-confirmation', { timeout: 30000 }).should(
			'be.visible'
		);
	});

	it('Can initiate checkout with PayPal', () => {
		// choose paypal.
		cy.get('.sc-paypal-toggle').shadow().find('.details').click();

		// fill customer name and email
		cy.get('sc-customer-name').invoke('attr', 'value', 'John Doe');
		cy.get('sc-customer-email').invoke('attr', 'value', 'test@test.com');

		cy.get('sc-paypal-buttons')
			.shadow()
			.find('.sc-paypal-button')
			.should('be.visible');

		cy.get('sc-paypal-buttons')
			.find('iframe.visible')
			.iframe()
			.find('div[data-funding-source="paypal"]')
			.last()
			.click();

		cy.intercept({
			method: 'POST',
			path: '**surecart**checkouts*',
			times: 1,
		}).as('updateCheckout');
		cy.intercept('POST', '**surecart**finalize*').as('finalizeOrder');

		// update the order.
		cy.wait('@updateCheckout', { timeout: 30000 }).then(
			({ request, response }) => {
				expect(request.body.email).to.eq('test@test.com');
				expect(request.body.name).to.eq('John Doe');
				expect(response.statusCode).to.eq(200);
				expect(response.body.status).to.eq('draft');
			}
		);

		// finalize the order.
		cy.wait('@finalizeOrder', { timeout: 30000 }).then(({ response }) => {
			expect(response.statusCode).to.eq(200);
			expect(response.body.status).to.eq('finalized');
		});

		// cy.paypalFlow('sb-3xe6d15890862@personal.example.com', 'P@pj0>v3');

		// thank you page.
		// cy.get('sc-order-confirmation', { timeout: 30000 }).should(
		// 	'be.visible'
		// );
	});

	it('Can checkout with a free product', () => {
		cy.intercept({
			method: 'POST',
			path: '**surecart**checkouts*',
			times: 1,
		}).as('createCheckout');

		// wait for order to create.
		cy.wait('@createCheckout');

		// fill customer name and email
		cy.get('sc-customer-name').invoke('attr', 'value', 'John Doe');
		cy.get('sc-customer-email').invoke('attr', 'value', 'test@test.com');

		// we will intercept confirm order.
		cy.intercept({
			method: 'POST',
			path: '**surecart**checkouts*',
			times: 1,
		}).as('updateCheckout');
		cy.intercept('POST', '**surecart**finalize*').as('finalizeOrder');
		cy.intercept('POST', '**surecart**confirm*').as('confirmOrder');

		cy.get('sc-order-submit sc-button')
			.shadow()
			.find('.button')
			.should('not.have.class', 'button--loading')
			.click({ force: true, waitForAnimations: true });

		// update the order.
		cy.wait('@updateCheckout', { timeout: 30000 }).then(
			({ request, response }) => {
				expect(request.body.email).to.eq('test@test.com');
				expect(request.body.name).to.eq('John Doe');
				expect(response.statusCode).to.eq(200);
				expect(response.body.status).to.eq('draft');
			}
		);

		// finalize the order.
		cy.wait('@finalizeOrder', { timeout: 30000 }).then(({ response }) => {
			expect(response.statusCode).to.eq(200);
			expect(response.body.status).to.eq('paid');
		});

		// confirm payment (and run automations)
		cy.wait('@confirmOrder', { timeout: 30000 }).then(({ response }) => {
			expect(response.statusCode).to.eq(200);
			expect(response.body.status).to.eq('paid');
		});

		// thank you page.
		cy.get('sc-order-confirmation', { timeout: 30000 }).should(
			'be.visible'
		);
	});
});
