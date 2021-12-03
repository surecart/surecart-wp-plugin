describe( 'Admin', () => {
	describe( 'Coupon', () => {
		let coupon, promotion;
		beforeEach( () => {
			cy.fixture( 'coupon/new-coupon' ).then( ( json ) => {
				coupon = json;
			} );
			cy.fixture( 'promotion/new-promotion' ).then( ( json ) => {
				promotion = json;
			} );
		} );

		it.only( 'Can edit a coupon', () => {
			cy.intercept( 'GET', '**checkout-engine**coupons*', coupon ).as(
				'getCoupons'
			);
			cy.intercept( 'GET', '**checkout-engine**promotions*', [
				promotion,
			] ).as( 'getPromotions' );
			cy.visit(
				`/wp-admin/admin.php?page=ce-coupons&action=edit&id=${ coupon.id }`
			);
			cy.wait( '@getCoupons' ).then( ( { response } ) => {
				expect( response.body.id ).to.equal( coupon.id );
				expect( response.statusCode ).to.eq( 200 );
			} );
			cy.get( '.ce-discount-duration-trigger' ).click( { force: true } );
			cy.get( '.ce-discount-menu-repeating' ).click( { force: true } );
			cy.get( '.ce-duration-in-months' ).should( 'be.visible' );
			cy.get( '.ce-duration-in-months' )
				.shadow()
				.find( 'input' )
				.type( '4', { force: true } );

			cy.get( '.ce-redeem-by.hydrated' )
				.shadow()
				.find( 'input' )
				.click( { force: true } );
			cy.get( '.redeem-by-date' ).should( 'be.visible' );

			cy.get( '.ce-max-redemptions.hydrated' )
				.shadow()
				.find( 'input' )
				.click( { force: true } );
			cy.get( '.max-redemptions-input' ).should( 'be.visible' );
			cy.get( '.max-redemptions-input' ).should( 'have.value', '1' );

			cy.get( '.max-redemptions-input' )
				.shadow()
				.find( 'input' )
				.type( '4', { force: true } );

			cy.interceptWithFixture( 'POST', '**coupons*', {
				fixture: 'coupon/new-coupon',
				as: 'couponRequest',
			} );

			cy.get( '.ce-save-model' ).click();

			cy.wait( '@couponRequest' ).then( ( { response, request } ) => {
				const time = new Date().getTime() - request.body.redeem_by;
				expect( time ).to.below( 10000 );
				expect( request.body.max_redemptions ).to.eq( '14' );
				expect( response.statusCode ).to.eq( 200 );
			} );
		} );

		it( 'Can create a coupon', () => {
			cy.visit( '/wp-admin/admin.php?page=ce-coupons&action=edit' );
			cy.get( '.ce-coupon-name' )
				.shadow()
				.find( 'input' )
				.type( 'name', { force: true } );
			cy.get( '.ce-percent-off' )
				.shadow()
				.find( 'input' )
				.type( '10', { force: true } );

			cy.interceptWithFixture( 'POST', '**coupons*', {
				fixture: 'coupon/new-coupon',
				as: 'couponRequest',
			} );

			cy.interceptWithFixture( 'POST', '**promotions*', {
				fixture: 'promotion/new-promotion',
				as: 'promotionRequest',
			} );

			cy.get( '.ce-save-model' ).click();

			cy.wait( '@couponRequest' ).then( ( { response, request } ) => {
				expect( request.body.percent_off ).to.equal( '10' );
				expect( request.body.name ).to.equal( 'name' );
				expect( response.statusCode ).to.eq( 200 );
				cy.updateFixture( 'coupon/new-coupon', response.body );
			} );

			cy.wait( '@promotionRequest' ).then( ( { request } ) => {
				expect( request.body.coupon_id ).to.equal( coupon.id );
				expect( request.body.currency ).to.equal( coupon.currency );
				cy.get( '.ce-promotion-code' ).should(
					'have.value',
					promotion.code
				);
			} );
		} );
	} );
} );
