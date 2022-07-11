describe('Cart', () => {
	let cartPage;

	before(() => {
		cy.exec(
			`yarn wp-env run tests-cli "wp eval '\SureCart::page_seeder()->seed();'"`
		);
	});

	beforeEach(() => {
		cy.fixture('cart/add-to-cart-page').then((template) => {
			cartPage = template.replace(/[\""]/g, '\\"');
		});
	});

	it('Can add to cart and proceed to checkout', () => {
		cy.exec(
			`yarn wp-env run tests-cli "wp post create --post_content='${cartPage}' --post_type=page --post_title='Cart Buttons' --post_status='publish' --porcelain"`
		).then((response) => {
			cy.clearLocalStorage();
			cy.visit(`?p=${parseInt(response.stdout)}`);

			// click the add to cart button.
			cy.get('sc-cart-form sc-button')
				.shadow()
				.find('button')
				.click({ force: true });

			cy.get('sc-cart-form sc-button').should('have.attr', 'loading');

			// the panel should open with the correct stuff.
			cy.get('sc-cart-loader')
				.shadow()
				.find('sc-line-items')
				.shadow()
				.find('sc-product-line-item')
				.should('have.length', 1)
				.shadow()
				.find('sc-quantity-select')
				.should('be.visible')
				.should('have.attr', 'quantity', '1');

			// close the cart.
			cy.get('sc-cart-loader')
				.shadow()
				.find('sc-cart-header')
				.shadow()
				.find('.cart__close')
				.click();

			// the icon and counter should be correct.
			cy.get('sc-cart-loader')
				.shadow()
				.find('sc-cart')
				.shadow()
				.find('sc-cart-icon')
				.shadow()
				.find('.cart')
				.should('be.visible')
				.find('.cart__counter')
				.contains('1');

			// click the add to cart button.
			cy.get('sc-cart-form sc-button')
				.shadow()
				.find('button')
				.click({ force: true });

			// the panel should open with a count of 2
			cy.get('sc-cart-loader')
				.shadow()
				.find('sc-line-items')
				.shadow()
				.find('sc-product-line-item')
				.should('have.length', 1)
				.shadow()
				.find('sc-quantity-select')
				.should('be.visible')
				.should('have.attr', 'quantity', '2');

			cy.reload();

			// the icon and counter should be correct.
			cy.get('sc-cart-loader')
				.shadow()
				.find('sc-cart')
				.shadow()
				.find('sc-cart-icon')
				.shadow()
				.find('.cart')
				.should('be.visible')
				.find('.cart__counter')
				.contains('2');

			// open the cart.
			cy.get('sc-cart-loader')
				.shadow()
				.find('sc-cart')
				.shadow()
				.find('sc-cart-icon')
				.click({ force: true });

			// go to checkout.
			cy.get('sc-cart-loader')
				.shadow()
				.find('sc-cart-submit sc-button')
				.shadow()
				.find('a')
				.click({ force: true, waitForAnimations: true });

			cy.get('sc-checkout').should('be.visible');
		});
	});
});
