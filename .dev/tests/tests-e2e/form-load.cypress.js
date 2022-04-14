describe('Form', () => {
	describe('Load', () => {
		let defaultForm;
		beforeEach(() => {
			cy.fixture('forms/default').then((template) => {
				defaultForm = template;
			});
		});

		it('Loads the default form', () => {
			cy.exec(
				`yarn wp-env run tests-cli "wp post create --post_content='<!-- wp:surecart/form {"mode":"test", currency: "usd"} -->${defaultForm}<!-- /wp:surecart/form -->' --post_type=page --post_title='Default Form' --post_status='publish' --porcelain"`
			).then((response) => {
				cy.interceptWithFixture('POST', '**surecart**orders*', {
					fixture: 'orders/basic-order',
				});
				cy.clearCookies();
				cy.visit(`?p=${parseInt(response.stdout)}`);
			});
		});
	});
});
