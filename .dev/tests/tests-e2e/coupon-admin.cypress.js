describe('Admin', () => {
	describe('Coupon', () => {
		let coupon, promotion;

		beforeEach(() => {
			cy.fixture('coupon/new-coupon').then((json) => {
				coupon = json;
			});
			cy.fixture('promotion/new-promotion').then((json) => {
				promotion = json;
			});
			cy.login(Cypress.env('wpUsername'), Cypress.env('wpPassword'));
		});

		it('Can create a coupon', () => {
			cy.visit('/wp-admin/admin.php?page=sc-coupons&action=edit');
			cy.get('.sc-coupon-name')
				.shadow()
				.find('input')
				.type('name', { force: true });
			cy.get('.sc-percent-off')
				.shadow()
				.find('input')
				.type('10', { force: true });

			cy.interceptWithFixture('POST', '**coupons*', {
				fixture: 'coupon/new-coupon',
				as: 'couponRequest',
			});

			cy.get('.sc-save-model')
				.shadow()
				.find('button')
				.click({ force: true });

			cy.wait('@couponRequest').then(({ request }) => {
				cy.get('.sc-promotion-code').should(
					'have.value',
					coupon.promotions.data[0].code
				);
			});
		});

		it('Can edit a coupon', () => {
			cy.interceptWithFixture('GET', '**surecart**coupons*', {
				fixture: 'coupon/new-coupon',
			});

			cy.visit(
				`/wp-admin/admin.php?page=sc-coupons&action=edit&id=${coupon.id}`
			);

			// duration
			cy.get('.sc-discount-duration-trigger').click({ force: true });
			cy.get('.sc-discount-menu-repeating').click({ force: true });
			cy.get('.sc-duration-in-months')
				.should('be.visible')
				.shadow()
				.find('input')
				.type('4', { force: true });

			// redemption
			cy.get('.sc-redeem-by.hydrated')
				.shadow()
				.find('input')
				.click({ force: true });
			cy.get('.sc-redeem-by-date').should('be.visible');
			cy.get('.sc-max-redemptions.hydrated')
				.shadow()
				.find('input')
				.click({ force: true });
			cy.get('.max-redemptions-input.hydrated')
				.should('be.visible')
				.should('have.value', '1')
				.shadow()
				.find('input')
				.type('4', { force: true });

			cy.get('.sc-promotion-code-add.hydrated').click({ force: true });
			cy.get('.sc-promotion-code').its('length').should('eq', 2);

			cy.interceptWithFixture('POST', '**coupons*', {
				fixture: 'coupon/new-coupon',
				as: 'couponRequest',
			});

			cy.interceptWithFixture('POST', '**promotions*', {
				fixture: 'promotion/promotions',
				as: 'promotionsRequest',
			});

			cy.get('.sc-save-model')
				.shadow()
				.find('button')
				.click({ force: true });

			cy.wait('@couponRequest').then(({ response, request }) => {
				const time = new Date().getTime() - request.body.redeem_by;
				expect(time).to.below(10000);
				expect(request.body.max_redemptions).to.eq('14');
				expect(response.statusCode).to.eq(200);
			});

			cy.wait('@promotionsRequest').then(({ request }) => {
				expect(request.body.coupon_id).to.equal(coupon.id);
				expect(request.body.currency).to.equal(coupon.currency);
			});
		});
	});
});
