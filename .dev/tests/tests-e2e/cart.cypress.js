describe('Cart', () => {
	let cartPage, adHocCartPage;

	before(() => {
		cy.exec(
			`yarn wp-env run tests-cli "wp eval '\SureCart::page_seeder()->seed();'"`
		);
	});

	beforeEach(() => {
		cy.fixture('cart/add-to-cart-page').then((template) => {
			cartPage = template.replace(/[\""]/g, '\\"');
		});
		cy.fixture('cart/add-to-cart-ad-hoc-page').then((template) => {
			adHocCartPage = template.replace(/[\""]/g, '\\"');
		});
	});

	const closeCart = () => {
		cy.get('sc-cart-loader')
			.shadow()
			.find('sc-cart-header')
			.shadow()
			.find('.cart__close')
			.click();
	};

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
				.find('sc-line-items', { timeout: 10000 })
				.shadow()
				.find('sc-product-line-item')
				.should('have.length', 1)
				.shadow()
				.find('sc-quantity-select', { timeout: 10000 })
				.should('be.visible')
				.should('have.attr', 'quantity', '1');

			// close the cart.
			closeCart();

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
				.find('sc-line-items', { timeout: 10000 })
				.shadow()
				.find('sc-product-line-item')
				.should('have.length', 1)
				.shadow()
				.find('sc-quantity-select', { timeout: 10000 })
				.should('be.visible')
				.should('have.attr', 'quantity', '2');

			cy.reload(true);

			// the icon and counter should be correct.
			cy.get('sc-cart-loader')
				.shadow()
				.find('sc-cart')
				.shadow()
				.find('sc-cart-icon')
				.shadow()
				.find('.cart__counter')
				.contains('2');

			// open the cart.
			cy.get('sc-cart-loader')
				.shadow()
				.find('sc-cart')
				.shadow()
				.find('sc-cart-icon')
				.click({ force: true });

			// click increase,
			cy.get('sc-cart-loader')
				.shadow()
				.find('sc-line-items', { timeout: 10000 })
				.shadow()
				.find('sc-product-line-item')
				.should('have.length', 1)
				.shadow()
				.find('sc-quantity-select', { timeout: 10000 })
				.shadow()
				.find('.button__increase')
				.click();

			cy.get('sc-cart-loader')
				.shadow()
				.find('sc-cart-submit sc-button')
				.should('have.attr', 'loading');

			cy.get('sc-cart-loader')
				.shadow()
				.find('sc-cart-submit sc-button')
				.should('not.have.attr', 'loading');

			cy.get('sc-cart-loader')
				.shadow()
				.find('sc-line-items', { timeout: 10000 })
				.shadow()
				.find('sc-product-line-item')
				.should('have.length', 1)
				.shadow()
				.find('sc-quantity-select', { timeout: 10000 })
				.should('be.visible')
				.should('have.attr', 'quantity', '3');

			// go to checkout.
			cy.get('sc-cart-loader')
				.shadow()
				.find('sc-cart-submit sc-button')
				.shadow()
				.find('a')
				.click({ force: true, waitForAnimations: true });

			cy.get('sc-checkout sc-line-items')
				.shadow()
				.find('sc-product-line-item')
				.should('have.length', 1)
				.shadow()
				.find('sc-quantity-select', { timeout: 10000 })
				.should('be.visible')
				.should('have.attr', 'quantity', '3');
		});
	});

	it('Can add an ad_hoc price', () => {
		cy.exec(
			`yarn wp-env run tests-cli "wp post create --post_content='${adHocCartPage}' --post_type=page --post_title='Cart Buttons' --post_status='publish' --porcelain"`
		).then((response) => {
			cy.clearLocalStorage();
			cy.visit(`?p=${parseInt(response.stdout)}`);

			cy.get('sc-price-input', { timeout: 10000 })
				.shadow()
				.find('sc-input')
				.shadow()
				.find('input')
				.type('12345', { force: true });

			cy.get('sc-cart-form sc-button')
				.shadow()
				.find('button')
				.click({ force: true });

			// the panel should open with a count of 2
			cy.get('sc-cart-loader')
				.shadow()
				.find('sc-line-items', { timeout: 10000 })
				.shadow()
				.find('sc-product-line-item')
				.should('have.length', 1)
				.shadow()
				.find('div')
				.should('contain', '$12,345.00')
				.find('sc-quantity-select')
				.should('not.exist');

			closeCart();

			cy.get('sc-price-input', { timeout: 10000 })
				.shadow()
				.find('sc-input')
				.shadow()
				.find('input')
				.clear({ force: true })
				.type('98765', { force: true });

			cy.get('sc-cart-form sc-button')
				.shadow()
				.find('button')
				.click({ force: true });

			cy.get('sc-cart-loader')
				.shadow()
				.find('sc-line-items', { timeout: 10000 })
				.shadow()
				.find('sc-product-line-item')
				.should('have.length', 1)
				.shadow()
				.find('div')
				.as('lineItem')
				.should('contain', '$98,765.00')
				.find('sc-quantity-select')
				.should('not.exist');

			cy.get('@lineItem').find('.item__remove').click();
			cy.get('sc-cart-loader')
				.shadow()
				.find('sc-line-items', { timeout: 10000 })
				.shadow()
				.find('sc-product-line-item')
				.should('not.exist');
		});
	});
});
