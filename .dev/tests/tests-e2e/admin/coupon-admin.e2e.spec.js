import {
	visitAdminPage,
	setUpResponseMocking,
} from '@wordpress/e2e-test-utils';

const COUPON_SUCCESS = {
	amount_off: 2500,
	created_at: 1629466950,
	currency: 'usd',
	duration: 'repeating',
	duration_in_months: 11,
	expired: false,
	id: '5d1da0a5-3237-4724-a176-44c930d03d0a',
	max_redemptions: null,
	metadata: {},
	name: 'SpringSale',
	object: 'coupon',
	percent_off: null,
	redeem_by: null,
	times_redeemed: 4,
	updated_at: 1629466950,
};

const PROMOTION_SUCCESS = {
	id: 'd6571a22-ef25-444f-a4fd-5edbbb6aa28f',
	object: 'promotion',
	code: 'SPRING2021',
	redeem_by: 1641048120000,
	max_redemptions: 11,
	times_redeemed: 4,
	active: true,
	metadata: {},
	expired: false,
	coupon: {
		id: '5d1da0a5-3237-4724-a176-44c930d03d0a',
		object: 'coupon',
		name: 'SpringSale',
		amount_off: null,
		percent_off: 25,
		currency: 'usd',
		duration: 'once',
		duration_in_months: null,
		redeem_by: 1641048120000,
		max_redemptions: null,
		times_redeemed: 0,
		metadata: {},
		expired: false,
		created_at: 1629466950,
		updated_at: 1629466950,
	},
	created_at: 1629466950,
	updated_at: 1629469013,
};

const VALIDATION_ERROR = {
	code: 'coupon.invalid',
	message: 'Test error response.',
	data: {
		status: 422,
		type: 'invalid',
		http_status: 'unprocessable_entity',
	},
	additional_errors: [
		{
			code: 'coupon.name.blank',
			message: 'Test name validation.',
			data: {
				attribute: 'name',
				type: 'blank',
				options: [],
			},
		},
		{
			code: 'coupon.amount_off.blank',
			message: 'Test amount validation.',
			data: {
				attribute: 'amount_off',
				type: 'blank',
				options: { unless: [] },
			},
		},
		{
			code: 'coupon.percent_off.blank',
			message: 'Test percent validation.',
			data: {
				attribute: 'percent_off',
				type: 'blank',
				options: { unless: [] },
			},
		},
	],
};

describe('Coupon Admin', () => {
	let form, saveButton;

	beforeEach(async () => {
		await visitAdminPage('admin.php', 'page=sc-coupons&action=edit');
		form = await page.waitForSelector('.sc-model-form');
		saveButton = await page.waitForSelector('.sc-save-model');
	});

	afterEach(async () => {
		await setUpResponseMocking([]);
	});

	// get html5 validation to pass
	const fillDummyData = async () => {
		await page.type('.sc-coupon-name', 'name');
		await page.type('.sc-percent-off', '10');
	};

	// save the page.
	const save = async () => {
		await page.waitForSelector('.sc-save-model');
		await saveButton.click();
	};

	const createCoupon = async () => {
		setUpResponseMocking([
			{
				match: (request) => {
					return (
						request.url().includes('coupons') &&
						request.method() === 'POST'
					);
				},
				onRequestMatch: (request) => {
					return request.respond({
						contentType: 'application/json',
						status: 200,
						body: JSON.stringify(COUPON_SUCCESS),
					});
				},
			},
			{
				match: (request) => {
					return (
						request.url().includes('promotions') &&
						request.method() === 'POST'
					);
				},
				onRequestMatch: (request) => {
					return request.respond({
						contentType: 'application/json',
						status: 200,
						body: JSON.stringify(PROMOTION_SUCCESS),
					});
				},
			},
		]);

		// get html5 validation to pass
		await page.type('.sc-coupon-name', 'name');
		await page.type('.sc-percent-off', '10');

		// submit
		await page.waitForSelector('.sc-save-model');
		await saveButton.click();
	};

	// it( 'Displays a generic error', async () => {
	// 	setUpResponseMocking( [
	// 		{
	// 			match: ( request ) => {
	// 				return (
	// 					request.url().includes( 'coupons' ) &&
	// 					request.method() === 'POST'
	// 				);
	// 			},
	// 			onRequestMatch: ( request ) => {
	// 				return request.respond( {
	// 					contentType: 'application/json',
	// 					status: 500,
	// 					body: JSON.stringify( {} ),
	// 				} );
	// 			},
	// 		},
	// 	] );

	// 	await fillDummyData();
	// 	await save();

	// 	// snackbar errors
	// 	const notice = await page.waitForSelector(
	// 		'.components-snackbar.is-snackbar-error'
	// 	);
	// 	expect( await notice.evaluate( ( node ) => node.innerText ) ).toContain(
	// 		'Something went wrong.'
	// 	);
	// } );

	// it( 'Displays snackbar and validation errors', async () => {
	// 	setUpResponseMocking( [
	// 		{
	// 			match: ( request ) => {
	// 				return (
	// 					request.url().includes( 'coupons' ) &&
	// 					request.method() === 'POST'
	// 				);
	// 			},
	// 			onRequestMatch: ( request ) => {
	// 				return request.respond( {
	// 					contentType: 'application/json',
	// 					status: 422,
	// 					body: JSON.stringify( VALIDATION_ERROR ),
	// 				} );
	// 			},
	// 		},
	// 	] );

	// 	// check html5 validation
	// 	await saveButton.click();
	// 	expect(
	// 		await form.evaluate( ( node ) => node.checkValidity() )
	// 	).toBeFalsy();

	// 	await fillDummyData();
	// 	await save();

	// 	// snackbar errors
	// 	const notice = await page.waitForSelector(
	// 		'.components-snackbar.is-snackbar-error'
	// 	);
	// 	expect( await notice.evaluate( ( node ) => node.innerText ) ).toContain(
	// 		'Test error response.'
	// 	);

	// 	// make sure these fields are invalid.
	// 	const nameError = await page.waitForSelector(
	// 		'.sc-coupon-name .sc-validation-error'
	// 	);
	// 	expect(
	// 		await nameError.evaluate( ( node ) => node.innerText )
	// 	).toContain( 'Test name validation.' );

	// 	const percentError = await page.waitForSelector(
	// 		'.sc-percent-off .sc-validation-error'
	// 	);
	// 	expect(
	// 		await percentError.evaluate( ( node ) => node.innerText )
	// 	).toContain( 'Test percent validation.' );
	// 	await page.click( '.sc-type input[value="fixed"]' );

	// 	// check html5 validation
	// 	await saveButton.click();
	// 	expect(
	// 		await form.evaluate( ( node ) => node.checkValidity() )
	// 	).toBeFalsy();

	// 	// fill field
	// 	await page.waitForSelector( '.sc-amount-off' );
	// 	await page.type( '.sc-amount-off input', '20' );

	// 	// save
	// 	await saveButton.click();

	// 	// show server validation error.
	// 	const amountError = await page.waitForSelector(
	// 		'.sc-amount-off .sc-validation-error'
	// 	);
	// 	expect(
	// 		await amountError.evaluate( ( node ) => node.innerText )
	// 	).toContain( 'Test amount validation.' );
	// } );

	// it( 'Can create a coupon', async () => {
	// 	await createCoupon();

	// 	// snackbar errors
	// 	const notice = await page.waitForSelector( '.components-snackbar' );
	// 	expect( await notice.evaluate( ( node ) => node.innerText ) ).toContain(
	// 		'Saved.'
	// 	);

	// 	// page url should update
	// 	expect( page.url() ).toContain(
	// 		'id=d6571a22-ef25-444f-a4fd-5edbbb6aa28f'
	// 	);

	// 	// name updated.
	// 	expect(
	// 		await page.$eval( '.sc-coupon-name', ( input ) => input.value )
	// 	).toBe( 'SpringSale' );

	// 	// code updated.
	// 	expect(
	// 		await page.$eval( '.sc-promotion-code', ( input ) => input.value )
	// 	).toBe( 'SPRING2021' );

	// 	// fixed should be checked by default.
	// 	expect(
	// 		await page.$eval(
	// 			'.sc-type input[value="fixed"]',
	// 			( input ) => input.checked
	// 		)
	// 	).toBeTruthy();

	// 	// redeem by should be checked by default.
	// 	expect(
	// 		await page.$eval(
	// 			'.sc-redeem-by input[type="checkbox"]',
	// 			( input ) => input.checked
	// 		)
	// 	).toBeTruthy();

	// 	// assert date picker
	// 	expect(
	// 		await page.$eval(
	// 			'.sc-redeem-by .components-datetime__time-field-month-select',
	// 			( input ) => input.value
	// 		)
	// 	).toBe( '01' );
	// 	expect(
	// 		await page.$eval(
	// 			'.sc-redeem-by .components-datetime__time-field-day-input',
	// 			( input ) => input.value
	// 		)
	// 	).toBe( '01' );
	// 	expect(
	// 		await page.$eval(
	// 			'.sc-redeem-by .components-datetime__time-field-year-input',
	// 			( input ) => input.value
	// 		)
	// 	).toBe( '2022' );

	// 	// repeating
	// 	expect(
	// 		await page.$eval( '.sc-duration select', ( input ) => input.value )
	// 	).toBe( 'repeating' );
	// 	expect(
	// 		await page.$eval(
	// 			'.sc-duration-in-months input',
	// 			( input ) => input.value
	// 		)
	// 	).toBe( '11' );

	// 	// max redemptions.
	// 	expect(
	// 		await page.$eval(
	// 			'.sc-max-redemptions input[type="checkbox"]',
	// 			( input ) => input.checked
	// 		)
	// 	).toBeTruthy();

	// 	// max redemptions value.
	// 	expect(
	// 		await page.$eval(
	// 			'.sc-max-redemptions input[type="number"]',
	// 			( input ) => input.value
	// 		)
	// 	).toBe( '11' );
	// } );
});
