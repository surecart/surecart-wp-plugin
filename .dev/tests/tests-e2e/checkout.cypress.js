describe('Checkout', () => {
	before(() => {
		cy.exec(
			`yarn wp-env run tests-cli "wp eval '\SureCart::page_seeder()->seed();'"`
		);
	});

	it('Can checkout', () => {
		cy.exec(
			`yarn wp-env run tests-cli "wp option get surecart_checkout_page_id"`
		).then((response) => {
			cy.clearLocalStorage();

			// buy button link
			cy.visit(
				`?p=${parseInt(
					response.stdout
				)}&line_items[0][price_id]=c6019010-dd0a-4a63-9940-14588416f685&line_items[0][quantity]=1`
			);

			// fill customer name and email
			cy.get('sc-customer-name')
				.shadow()
				.find('sc-input')
				.shadow()
				.find('input')
				.type('John Doe', { force: true });
			cy.get('sc-customer-email')
				.shadow()
				.find('sc-input')
				.shadow()
				.find('input')
				.type('test@test.com', { force: true });

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
				path: '**surecart**orders*',
				times: 1,
			}).as('updateOrder');
			cy.intercept('POST', '**surecart**finalize*').as('finalizeOrder');
			cy.intercept('POST', '**surecart**confirm*').as('confirmOrder');

			cy.get('sc-order-submit sc-button')
				.shadow()
				.find('.button')
				.should('not.have.class', 'button--loading')
				.click({ force: true, waitForAnimations: true });

			cy.wait('@updateOrder', { timeout: 30000 }).then(
				({ request, response }) => {
					console.log({ request });
					expect(request.body.email).to.eq('test@test.com');
					expect(request.body.name).to.eq('John Doe');
					expect(response.statusCode).to.eq(200);
					expect(response.body.status).to.eq('draft');
				}
			);

			cy.wait('@finalizeOrder', { timeout: 30000 }).then(
				({ request, response }) => {
					console.log({ request });
					expect(response.statusCode).to.eq(200);
					expect(response.body.status).to.eq('finalized');
				}
			);

			cy.wait('@confirmOrder', { timeout: 30000 }).then(
				({ response }) => {
					expect(response.statusCode).to.eq(200);
					expect(response.body.status).to.eq('paid');
				}
			);

			cy.get('sc-order-confirmation', { timeout: 30000 }).should(
				'be.visible'
			);
		});
	});
});
