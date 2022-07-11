describe('Form', () => {
	describe('Processors', () => {
		let defaultForm, simpleForm;

		before(() => {
			Cypress.Cookies.defaults({
				preserve: [],
			});
			//Clear localStrage
			cy.clearLocalStorage();
			//Clear Cookies
			cy.clearCookies();
		});

		beforeEach(() => {
			cy.fixture('forms/default').then((template) => {
				defaultForm = template.replace(/[\""]/g, '\\"');
			});
			cy.fixture('forms/simple').then((template) => {
				simpleForm = template.replace(/[\""]/g, '\\"');
			});
		});

		it('Loads Paypal and Stripe Card Processors', () => {
			cy.exec(
				`yarn wp-env run tests-cli "wp post create --post_content='${defaultForm}' --post_type=page --post_title='Default Form' --post_status='publish' --porcelain"`
			).then((response) => {
				cy.interceptWithFixture('POST', '**surecart**orders*', {
					fixture: 'orders/one-time',
					as: 'createOrder',
				});
				cy.interceptWithFixture('GET', '**test_price_1*', {
					fixture: 'price/with-product',
					as: 'fetchPrice1',
					callback: (body) => {
						return body;
					},
				});
				cy.interceptWithFixture('GET', '**test_price_2*', {
					fixture: 'price/with-product',
					as: 'fetchPrice2',
					callback: (body) => {
						body[0].id = 'test_price_2';
						body[0].product.id = 'test_product_2';
						body[0].product.name = 'Test Product 2';
						return body;
					},
				});

				cy.intercept('POST', '**payment_intents*').as(
					'createPaymentIntent'
				);

				cy.clearCookies();
				cy.visit(`?p=${parseInt(response.stdout)}`);
			});
		});

		it.skip('Loads Paypal and Stripe Payment Element Processors', () => {
			cy.exec(
				`yarn wp-env run tests-cli "wp post create --post_content='${defaultForm}' --post_type=page --post_title='Default Form' --post_status='publish' --porcelain"`
			).then((response) => {
				cy.interceptWithFixture('POST', '**surecart**orders*', {
					fixture: 'orders/one-time',
					as: 'createOrder',
				});
				cy.interceptWithFixture('GET', '**test_price_1*', {
					fixture: 'price/with-product',
					as: 'fetchPrice1',
					callback: (body) => {
						return body;
					},
				});
				cy.interceptWithFixture('GET', '**test_price_2*', {
					fixture: 'price/with-product',
					as: 'fetchPrice2',
					callback: (body) => {
						body[0].id = 'test_price_2';
						body[0].product.id = 'test_product_2';
						body[0].product.name = 'Test Product 2';
						return body;
					},
				});

				cy.intercept('POST', '**payment_intents*').as(
					'createPaymentIntent'
				);

				cy.clearCookies();
				cy.visit(`?p=${parseInt(response.stdout)}`);

				// this is how we fill out the form:
				cy.wait('@createPaymentIntent').then(() => {
					cy.get('.StripeElement').should('exist');
					cy.getStripeElement('numberInput').should('be.visible');
					cy.getStripeElement('expiryInput').should('be.visible');
					cy.getStripeElement('cvcInput').should('be.visible');
					cy.getStripeElement('postalCodeInput').should('be.visible');
				});

				// cy.wait('@createOrder').then(({ request }) => {
				// 	cy.get('sc-customer-name.hydrated').should(
				// 		'have.value',
				// 		'admin'
				// 	);
				// 	cy.get('sc-customer-email.hydrated').should(
				// 		'have.value',
				// 		'wordpress@example.com'
				// 	);
				// 	cy.get('sc-choice.hydrated[value="test_price_1"]')
				// 		.shadow()
				// 		.find('input')
				// 		.should('be.checked');
				// });
			});
		});

		it.skip('Loads Paypal Only Processors', () => {
			cy.exec(
				`yarn wp-env run tests-cli "wp post create --post_content='${simpleForm}' --post_type=page --post_title='Default Form' --post_status='publish' --porcelain"`
			).then((response) => {
				cy.fixture('orders/one-time').then((body) => {
					cy.intercept('POST', '**surecart**orders*', (req) => {
						req.reply({
							body,
							delay: 1000,
						});
					}).as('createOrder');
				});

				cy.clearCookies();
				cy.visit(`?p=${parseInt(response.stdout)}`);

				cy.get('sc-checkout').then(function ($input) {
					$input[0].processors = $input[0].processors.filter(
						(processor) => processor?.processor_type === 'paypal'
					);
					$input.processor = 'paypal';
				});

				cy.get('[data-test-id="paypal-credit-card-toggle"]').click();

				cy.get(
					'sc-payment [data-test-id="paypal-credit-card-toggle"]'
				).should('have.attr', 'open');
				cy.get('sc-payment [data-test-id="paypal-toggle"]').should(
					'not.have.attr',
					'open'
				);

				cy.get('sc-paypal-buttons')
					.shadow()
					.find('.sc-paypal-card-button')
					.should('be.visible');
				cy.get('sc-paypal-buttons')
					.shadow()
					.find('.sc-paypal-button')
					.should('not.be.visible');

				cy.get('[data-test-id="paypal-toggle"]').click();
				cy.get(
					'sc-payment [data-test-id="paypal-credit-card-toggle"]'
				).should('not.have.attr', 'open');
				cy.get('sc-payment [data-test-id="paypal-toggle"]').should(
					'have.attr',
					'open'
				);

				cy.get('sc-paypal-buttons')
					.shadow()
					.find('.sc-paypal-card-button')
					.should('not.be.visible');
				cy.get('sc-paypal-buttons')
					.shadow()
					.find('.sc-paypal-button')
					.should('be.visible');
			});
		});

		it.skip('Loads Stripe Only Processors', () => {
			cy.exec(
				`yarn wp-env run tests-cli "wp post create --post_content='${simpleForm}' --post_type=page --post_title='Default Form' --post_status='publish' --porcelain"`
			).then((response) => {
				cy.fixture('orders/one-time').then((body) => {
					cy.intercept('POST', '**surecart**orders*', (req) => {
						req.reply({
							body,
							delay: 1000,
						});
					}).as('createOrder');
				});

				cy.intercept('POST', '**payment_intents*').as(
					'createPaymentIntent'
				);

				cy.clearCookies();
				cy.visit(`?p=${parseInt(response.stdout)}`);

				cy.get('sc-checkout').then(function ($input) {
					$input[0].processors = $input[0].processors.filter(
						(processor) => processor?.processor_type === 'stripe'
					);
					$input.processor = 'stripe';
				});

				// this is how we fill out the form:
				cy.wait('@createPaymentIntent').then(() => {
					cy.get('.StripeElement').should('exist');
					cy.getStripeElement('numberInput').should('be.visible');
					cy.getStripeElement('expiryInput').should('be.visible');
					cy.getStripeElement('cvcInput').should('be.visible');
					cy.getStripeElement('postalCodeInput').should('be.visible');
				});
			});
		});
	});
});
