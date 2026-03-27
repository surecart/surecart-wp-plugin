/**
 * External dependencies.
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies.
 */
import { create as createAccount } from '../provisional-account';

const INVOICES_PAGE = '/wp-admin/admin.php?page=sc-invoices';

/**
 * Generate a unique suffix for emails to avoid collisions across test runs.
 */
function uid() {
	return `${ Date.now() }${ Math.random().toString( 36 ).slice( 2, 6 ) }`;
}

/**
 * Helper: create a customer via REST API with a unique email.
 */
async function createCustomer( requestUtils, data: { name: string; email: string } ) {
	return await requestUtils.rest( {
		method: 'POST',
		path: '/surecart/v1/customers',
		data,
	} );
}

/**
 * Helper: navigate to invoice create page via list page "Add New" button.
 * The create route has nonce middleware, so we must navigate through the list page.
 */
async function navigateToInvoiceCreate( page ) {
	await page.goto( INVOICES_PAGE );
	await page.waitForLoadState( 'networkidle' );

	// Click "Add New" button (first link in the .sc-button-group, includes nonce in href).
	await page.locator( '.sc-button-group a.button' ).first().click();
	await page.waitForLoadState( 'networkidle' );
}

/**
 * Helper: locate the customer ModelSelector on the invoice create page.
 */
function getCustomerSelect( page ) {
	return page.locator( 'sc-select[placeholder="Select a customer"]' );
}

/**
 * Helper: open the customer ModelSelector dropdown.
 */
async function openCustomerSelector( page ) {
	const customerSelect = getCustomerSelect( page );
	await customerSelect.waitFor( { timeout: 15000 } );
	await customerSelect.click();
	await page.waitForLoadState( 'networkidle' );
	return customerSelect;
}

test.describe( 'Invoice Customer Selector', () => {
	test.beforeEach( async ( { requestUtils } ) => {
		await createAccount( requestUtils );
	} );

	test( 'Customer ModelSelector renders with custom display format and prefix slot', async ( {
		page,
		requestUtils,
	} ) => {
		const suffix = uid();
		const aliceEmail = `alice-${ suffix }@test.com`;
		const bobEmail = `bob-${ suffix }@test.com`;

		// Create 2 customers with unique emails.
		await Promise.all( [
			createCustomer( requestUtils, { name: 'Alice Smith', email: aliceEmail } ),
			createCustomer( requestUtils, { name: 'Bob Jones', email: bobEmail } ),
		] );

		await navigateToInvoiceCreate( page );
		await openCustomerSelector( page );

		// Assert prefix slot: "Add New" menu item is visible above customer options.
		await expect(
			page.locator( 'sc-menu-item:visible' ).filter( { hasText: 'Add New' } ).first()
		).toBeVisible( { timeout: 10000 } );

		// Assert custom display format: "Name - email".
		await expect(
			page.locator( 'sc-menu-item:visible' ).filter( { hasText: `Alice Smith - ${ aliceEmail }` } ).first()
		).toBeVisible( { timeout: 10000 } );
		await expect(
			page.locator( 'sc-menu-item:visible' ).filter( { hasText: `Bob Jones - ${ bobEmail }` } ).first()
		).toBeVisible( { timeout: 10000 } );
	} );

	test( 'Customer ModelSelector search filters customers', async ( {
		page,
		requestUtils,
	} ) => {
		const suffix = uid();
		const aliceSmithEmail = `alice.smith-${ suffix }@test.com`;
		const bobEmail = `bob.jones-${ suffix }@test.com`;
		const aliceBrownEmail = `alice.brown-${ suffix }@test.com`;

		// Create 3 customers: 2 with "Alice" in name, 1 with "Bob".
		await Promise.all( [
			createCustomer( requestUtils, { name: 'Alice Smith', email: aliceSmithEmail } ),
			createCustomer( requestUtils, { name: 'Bob Jones', email: bobEmail } ),
			createCustomer( requestUtils, { name: 'Alice Brown', email: aliceBrownEmail } ),
		] );

		await navigateToInvoiceCreate( page );
		const customerSelect = await openCustomerSelector( page );

		// Type the unique suffix in the search to scope results to just our test customers.
		const searchInput = customerSelect.locator( 'input[placeholder="Search..."]' );
		await searchInput.waitFor( { timeout: 10000 } );
		await searchInput.fill( `Alice ${ suffix }` );
		await page.waitForLoadState( 'networkidle' );

		// Should show only Alice customers.
		await expect(
			page.locator( 'sc-menu-item:visible' ).filter( { hasText: 'Alice Smith' } ).first()
		).toBeVisible( { timeout: 10000 } );
		await expect(
			page.locator( 'sc-menu-item:visible' ).filter( { hasText: 'Alice Brown' } ).first()
		).toBeVisible( { timeout: 10000 } );
		await expect(
			page.locator( 'sc-menu-item:visible' ).filter( { hasText: 'Bob Jones' } )
		).toHaveCount( 0 );
	} );

	test( 'Selecting customer replaces ModelSelector with customer info', async ( {
		page,
		requestUtils,
	} ) => {
		const suffix = uid();
		const testEmail = `test-${ suffix }@example.com`;

		// Create 1 customer.
		await createCustomer( requestUtils, { name: 'Test Customer', email: testEmail } );

		await navigateToInvoiceCreate( page );
		await openCustomerSelector( page );

		// Select "Test Customer" from the dropdown.
		const customerItem = page.locator( 'sc-menu-item:visible' ).filter( { hasText: `Test Customer - ${ testEmail }` } ).first();
		await customerItem.waitFor( { timeout: 10000 } );
		await customerItem.click();
		await page.waitForLoadState( 'networkidle' );

		// Assert: ModelSelector (sc-select) is no longer visible — replaced by Customer info component.
		await expect( getCustomerSelect( page ) ).not.toBeVisible( { timeout: 10000 } );

		// Assert: Customer info is displayed showing the selected customer's details.
		await expect( page.locator( 'text=Test Customer' ).first() ).toBeVisible( { timeout: 10000 } );
	} );
} );
