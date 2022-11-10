describe('Cart', () => {

	const closeCart = () => {
		cy.get('sc-cart-loader')
			.shadow()
			.find('sc-cart-header')
			.shadow()
			.find('.cart__close')
			.click();
	};

	it('Can add to cart ', () => {
			cy.clearLocalStorage();

      cy.visit('/test/sc-cart/button');

      cy.intercept('**/surecart/v1/checkouts/*', {
        id: "test",
        line_items: {
          pagination: {
            count: 1,
          },
          data: [
            {
              id: 'line_item',
              quantity: 1,
              price: {
                id: 'price_id',
                amount: 2000,
                currency: 'usd',
                product: {
                  id: 'product_id',
                  name: "Test"
                }
              }
            }
          ]
        }
      }).as('createGetCart');

			// click the add to cart button.
			cy.get('sc-cart-form-submit.hydrated sc-button.hydrated').find('button').click({force: true});

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

        // cy.intercept({path: '**/surecart/v1/checkouts/*', method: 'POST'}, {
        //   id: "test",
        //   line_items: {
        //     pagination: {
        //       count: 1,
        //     },
        //     data: [
        //       {
        //         id: 'line_item',
        //         quantity: 2,
        //         price: {
        //           id: 'price_id',
        //           amount: 2000,
        //           currency: 'usd',
        //           product: {
        //             id: 'product_id',
        //             name: "Test"
        //           }
        //         }
        //       }
        //     ]
        //   }
        // }).as('addQuantity');

			// click the add to cart button.
			// cy.get('sc-cart-form-submit sc-button')
			// 	.shadow()
			// 	.find('button')
			// 	.click({ force: true });

      // cy.wait('@addQuantity').its('request.body.line_items.0.quantity').should('equal',2);

			// // the panel should open with a count of 2
			// cy.get('sc-cart-loader')
			// 	.shadow()
			// 	.find('sc-line-items', { timeout: 10000 })
			// 	.shadow()
			// 	.find('sc-product-line-item')
			// 	.should('have.length', 1)
			// 	.shadow()
			// 	.find('sc-quantity-select', { timeout: 10000 })
			// 	.should('be.visible')
			// 	.should('have.attr', 'quantity', '2');
      });
});
