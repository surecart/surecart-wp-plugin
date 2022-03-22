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

			cy.interceptWithFixture('POST', '**promotions*', {
				fixture: 'promotion/new-promotion',
				as: 'promotionRequest',
			});

			cy.get('.sc-save-model').click();

			cy.wait('@couponRequest').then(({ response, request }) => {
				expect(request.body.percent_off).to.equal('10');
				expect(request.body.name).to.equal('name');
				expect(response.statusCode).to.eq(200);
				cy.updateFixture('coupon/new-coupon', response.body);
			});

			cy.wait('@promotionRequest').then(({ request }) => {
				expect(request.body.coupon_id).to.equal(coupon.id);
				expect(request.body.currency).to.equal(coupon.currency);
				cy.get('.sc-promotion-code').should(
					'have.value',
					promotion.code
				);
			});
		});

		it('Can edit a coupon', () => {
			cy.intercept('GET', '**surecart**coupons*', coupon).as(
				'getCoupons'
			);
			cy.intercept('GET', '**surecart**promotions*', [promotion]).as(
				'getPromotions'
			);
			cy.visit(
				`/wp-admin/admin.php?page=sc-coupons&action=edit&id=${coupon.id}`
			);
			cy.wait('@getCoupons').then(({ response }) => {
				expect(response.body.id).to.equal(coupon.id);
				expect(response.statusCode).to.eq(200);
			});

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
			cy.get('.redeem-by-date').should('be.visible');
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

			cy.get('.sc-promotion-code-add.hydrated').click();
			cy.get('.sc-promotion-code').its('length').should('eq', 2);

			cy.interceptWithFixture('POST', '**coupons*', {
				fixture: 'coupon/new-coupon',
				as: 'couponRequest',
			});

			cy.interceptWithFixture('POST', '**promotions*', {
				fixture: 'promotion/promotions',
				as: 'promotionsRequest',
			});

			cy.get('.sc-save-model').click();

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
