import {
	visitAdminPage,
	setUpResponseMocking,
} from '@wordpress/e2e-test-utils';

const PRODUCT_SUCCESS = {
	id: 'cee6a221-feea-4bc4-a450-ba120df2f203',
	object: 'product',
	name: 'Brand New',
	description: 'asdfasdf ',
	metadata: {},
	archived: false,
	prices: [
		{
			id: 'a9eddccd-ea07-43cc-9801-537334184734',
			object: 'price',
			name: 'Default',
			description: null,
			amount: 1000,
			currency: 'usd',
			recurring: true,
			recurring_interval: 'year',
			recurring_interval_count: 1,
			ad_hoc: false,
			ad_hoc_max_amount: null,
			ad_hoc_min_amount: 0,
			metadata: {},
			archived: false,
			archived_at: null,
			created_at: 1631737060,
			updated_at: 1631905697,
		},
	],
	archived_at: null,
	created_at: 1631737059,
	updated_at: 1631905697,
};

const PRICE_SUCCESS = {
	id: 'a9eddccd-ea07-43cc-9801-537334184734',
	object: 'price',
	name: 'Default',
	description: null,
	amount: 1000,
	currency: 'usd',
	recurring: true,
	recurring_interval: 'year',
	recurring_interval_count: 1,
	ad_hoc: false,
	ad_hoc_max_amount: null,
	ad_hoc_min_amount: 0,
	metadata: {},
	archived: false,
	product: {
		id: 'cee6a221-feea-4bc4-a450-ba120df2f203',
		object: 'product',
		name: 'Brand New',
		description: 'asdfasdf ',
		metadata: {},
		archived: false,
		archived_at: null,
		created_at: 1631737059,
		updated_at: 1631914518,
	},
	archived_at: null,
	created_at: 1631737060,
	updated_at: 1631905697,
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

describe( 'Product Admin', () => {
	let form, saveButton;

	afterEach( async () => {
		await setUpResponseMocking( [] );
	} );

	it( 'Displays a generic error', async () => {
		setUpResponseMocking( [
			{
				match: ( request ) => {
					return (
						request.url().includes( 'products/test' ) &&
						request.method() === 'GET'
					);
				},
				onRequestMatch: ( request ) => {
					return request.respond( {
						contentType: 'application/json',
						status: 500,
						body: JSON.stringify( {} ),
					} );
				},
			},
		] );

		await visitAdminPage(
			'admin.php',
			'page=ce-products&action=edit&id=test'
		);
		form = await page.waitForSelector( 'ce-form' );
		saveButton = await page.waitForSelector( '.ce-save-model' );

		// snackbar errors
		const notice = await page.waitForSelector(
			'.components-snackbar.is-snackbar-error'
		);
		expect( await notice.evaluate( ( node ) => node.innerText ) ).toContain(
			'Something went wrong.'
		);
	} );

	it( 'Can create a new product', async () => {
		setUpResponseMocking( [
			{
				match: ( request ) => {
					return (
						request.url().includes( 'products' ) &&
						request.method() === 'POST'
					);
				},
				onRequestMatch: ( request ) => {
					return request.respond( {
						contentType: 'application/json',
						status: 200,
						body: JSON.stringify( PRODUCT_SUCCESS ),
					} );
				},
			},
			{
				match: ( request ) => {
					return (
						request.url().includes( 'prices' ) &&
						request.method() === 'POST'
					);
				},
				onRequestMatch: ( request ) => {
					return request.respond( {
						contentType: 'application/json',
						status: 200,
						body: JSON.stringify( PRICE_SUCCESS ),
					} );
				},
			},
		] );

		await visitAdminPage( 'admin.php', 'page=ce-products&action=edit' );

		await page.$eval( '.ce-product-name', ( el ) => ( el.value = 'name' ) );
		await page.$eval(
			'.ce-product-description',
			( el ) => ( el.value = 'description' )
		);
		await page.$eval( '.ce-price-amount', ( el ) => ( el.value = '20' ) );

		saveButton = await page.waitForSelector( '.ce-save-model' );
		await saveButton.click();

		// snackbar
		const notice = await page.waitForSelector( '.components-snackbar' );
		expect( await notice.evaluate( ( node ) => node.innerText ) ).toContain(
			'Saved.'
		);

		// page url should update
		expect( page.url() ).toContain(
			'id=cee6a221-feea-4bc4-a450-ba120df2f203'
		);
	} );

	it( 'Displays snackbar and validation errors', async () => {
		setUpResponseMocking( [
			{
				match: ( request ) => {
					return (
						request.url().includes( 'coupons' ) &&
						request.method() === 'POST'
					);
				},
				onRequestMatch: ( request ) => {
					return request.respond( {
						contentType: 'application/json',
						status: 422,
						body: JSON.stringify( VALIDATION_ERROR ),
					} );
				},
			},
		] );

		await visitAdminPage( 'admin.php', 'page=ce-products&action=edit' );

		await page.$eval( '.ce-product-name', ( el ) => ( el.value = 'name' ) );
		await page.$eval(
			'.ce-product-description',
			( el ) => ( el.value = 'description' )
		);
		await page.$eval( '.ce-price-amount', ( el ) => ( el.value = '20' ) );

		saveButton = await page.$( '.ce-save-model' );
		await saveButton.click();

		// snackbar errors
		// const notice = await page.$( '.components-snackbar.is-snackbar-error' );
		// expect( await notice.evaluate( ( node ) => node.innerText ) ).toContain(
		// 	'Failed to save product'
		// );

		// make sure these fields are invalid.
		// const nameError = await page.$( 'ce-alert' );
		// expect(
		// 	await nameError.evaluate( ( node ) => node.innerText )
		// ).toContain( 'Test name validation.' );
	} );
} );
