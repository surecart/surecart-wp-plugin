describe('Cart', () => {
	let cartPage;

	before(() => {
		cy.exec(`wp eval 'do_action('admin_init')'`);
	});

	beforeEach(() => {
		cy.fixture('cart/add-to-cart-page').then((template) => {
			cartPage = template.replace(/[\""]/g, '\\"');
		});
	});

	it('Can add to a blank cart', () => {
		cy.exec(
			`yarn wp-env run tests-cli "wp post create --post_content='${cartPage}' --post_type=page --post_title='Cart Buttons' --post_status='publish' --porcelain"`
		).then((response) => {
			cy.visit(`?p=${parseInt(response.stdout)}`);
		});
	});
});
