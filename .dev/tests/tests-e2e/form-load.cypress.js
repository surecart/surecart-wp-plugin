describe('Form', () => {
	describe('Load', () => {
		let defaultForm;

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
		});

		it('Loads the default form', () => {
			cy.exec(
				`yarn wp-env run tests-cli "wp post create --post_content='<!-- wp:surecart/form {"mode":"test", currency: "usd"} -->${defaultForm}<!-- /wp:surecart/form -->' --post_type=page --post_title='Default Form' --post_status='publish' --porcelain"`
			).then((response) => {
				cy.interceptWithFixture('POST', '**surecart**orders*', {
					fixture: 'orders/with-everything',
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

				cy.clearCookies();
				cy.visit(`?p=${parseInt(response.stdout)}`);

				cy.wait('@createOrder').then(({ request }) => {
					cy.get('sc-customer-name.hydrated').should(
						'have.value',
						'admin'
					);
					cy.get('sc-customer-email.hydrated').should(
						'have.value',
						'wordpress@example.com'
					);
					cy.get('sc-choice.hydrated[value="test_price_1"]')
						.shadow()
						.find('input')
						.should('be.checked');
				});
			});
		});
	});
});
