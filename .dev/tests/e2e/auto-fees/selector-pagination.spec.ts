/**
 * External dependencies.
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies.
 */
import { create as createAccount } from '../provisional-account';
import { createProduct } from '../request-utils/products';

const AUTO_FEES_PAGE = '/wp-admin/admin.php?page=sc-auto-fees';

/**
 * Helper: fill the "Create new dynamic price" form and submit.
 */
async function createDynamicPrice( page, name: string ) {
	const nameInput = page.locator( 'sc-input[label="Name"]' );
	await nameInput.waitFor( { timeout: 15000 } );
	await nameInput.locator( 'input' ).fill( name );

	const displayNameInput = page.locator( 'sc-input[label="Display Name"]' );
	await displayNameInput.locator( 'input' ).fill( `${ name } Display` );

	const startFromScratch = page.locator( 'sc-choice' ).filter( { hasText: 'Start from scratch' } );
	await startFromScratch.click();

	const lineItemChoice = page.locator( 'sc-choice' ).filter( { hasText: 'Line Item' } );
	await lineItemChoice.click();

	const allTransactions = page.locator( 'sc-radio' ).filter( { hasText: 'All transactions' } );
	await allTransactions.click();

	const continueBtn = page.locator( 'sc-button[submit]' );
	await continueBtn.click();

	await page.waitForLoadState( 'networkidle' );
	await page.locator( 'text=Conditions' ).first().waitFor( { timeout: 15000 } );
}

/**
 * Helper: click "Add Conditions" on the edit page.
 */
async function addConditions( page ) {
	const addBtn = page.locator( 'sc-button' ).filter( { hasText: 'Add Conditions' } );
	await addBtn.waitFor( { timeout: 10000 } );
	await addBtn.click();
}

/**
 * Helper: select an attribute in the condition's attribute dropdown.
 */
async function selectAttribute( page, attributeLabel: string ) {
	const attributeSelect = page.locator( 'sc-select[placeholder="Select an attribute"]' ).first();
	await attributeSelect.waitFor( { timeout: 10000 } );
	await attributeSelect.click();

	const searchInput = page.locator( 'input[placeholder="Search..."]' ).first();
	await searchInput.waitFor( { timeout: 5000 } );
	await searchInput.fill( attributeLabel );

	const menuItem = page.locator( 'sc-menu-item:visible' ).filter( { hasText: attributeLabel } ).first();
	await menuItem.waitFor( { timeout: 10000 } );
	await menuItem.click();
}

/**
 * Helper: select the "is" operator in the condition row.
 */
async function selectOperatorIs( page ) {
	const operatorSelect = page.locator( 'sc-select[placeholder="Select a condition"]' ).first();
	await operatorSelect.waitFor( { timeout: 10000 } );
	await operatorSelect.click();

	const isMenuItem = page.locator( 'sc-menu-item[value="is"]' ).first();
	await isMenuItem.waitFor( { timeout: 5000 } );
	await isMenuItem.click();
}

/**
 * Helper: navigate to auto-fees, create a dynamic price, add conditions, and select Product + "is".
 */
async function navigateToProductModelSelector( page ) {
	await page.goto( AUTO_FEES_PAGE );
	await page.waitForLoadState( 'networkidle' );

	await page.locator( '.page-title-action' ).click();
	await page.waitForLoadState( 'networkidle' );

	await createDynamicPrice( page, 'Pagination Test' );
	await addConditions( page );
	await selectAttribute( page, 'Product' );
	await selectOperatorIs( page );
}

/**
 * Helper: open the ModelSelector dropdown (3rd sc-select in condition card).
 */
async function openModelSelector( page ) {
	const modelSelect = page.locator( 'sc-card sc-select' ).nth( 2 );
	await modelSelect.waitFor( { timeout: 10000 } );
	await modelSelect.click();
	await page.waitForLoadState( 'networkidle' );
	return modelSelect;
}

test.describe( 'Selector Pagination & Search', () => {
	test.beforeEach( async ( { requestUtils } ) => {
		await createAccount( requestUtils );
	} );

	test( 'ModelSelector shows first page of products', async ( {
		page,
		requestUtils,
	} ) => {
		// Create 12 products to exceed per_page=10.
		await Promise.all(
			Array.from( { length: 12 }, ( _, i ) =>
				createProduct( requestUtils, {
					name: `Paginate Product ${ String( i + 1 ).padStart( 2, '0' ) }`,
				} )
			)
		);

		await navigateToProductModelSelector( page );
		await openModelSelector( page );

		// Should show exactly 10 items (page 1 only).
		const menuItems = page.locator( 'sc-menu-item:visible' );
		await expect( menuItems ).toHaveCount( 10, { timeout: 10000 } );
	} );

	test( 'ModelSelector loads more on scroll to bottom', async ( {
		page,
		requestUtils,
	} ) => {
		await Promise.all(
			Array.from( { length: 12 }, ( _, i ) =>
				createProduct( requestUtils, {
					name: `Paginate Product ${ String( i + 1 ).padStart( 2, '0' ) }`,
				} )
			)
		);

		await navigateToProductModelSelector( page );
		await openModelSelector( page );

		// Wait for first page to load.
		const menuItems = page.locator( 'sc-menu-item:visible' );
		await expect( menuItems ).toHaveCount( 10, { timeout: 10000 } );

		// Dispatch scScrollEnd to trigger loading page 2.
		await page.locator( 'sc-card sc-select' ).nth( 2 ).evaluate(
			( el ) => el.dispatchEvent( new CustomEvent( 'scScrollEnd' ) )
		);
		await page.waitForLoadState( 'networkidle' );

		// Should now show all 12 items (page 1 + page 2).
		await expect( menuItems ).toHaveCount( 12, { timeout: 10000 } );
	} );

	test( 'ModelSelector search filters products', async ( {
		page,
		requestUtils,
	} ) => {
		// Create 3 distinctly named products.
		await Promise.all( [
			createProduct( requestUtils, { name: 'Alpha Widget' } ),
			createProduct( requestUtils, { name: 'Beta Gadget' } ),
			createProduct( requestUtils, { name: 'Alpha Device' } ),
		] );

		await navigateToProductModelSelector( page );
		await openModelSelector( page );

		// Type "Alpha" in the search input inside the ModelSelector dropdown.
		// Use the ModelSelector's sc-select to scope the search input (avoids the hidden attribute dropdown input).
		const modelSelectEl = page.locator( 'sc-card sc-select' ).nth( 2 );
		const searchInput = modelSelectEl.locator( 'input[placeholder="Search..."]' );
		await searchInput.waitFor( { timeout: 10000 } );
		await searchInput.fill( 'Alpha' );
		await page.waitForLoadState( 'networkidle' );

		// Should show only Alpha products.
		await expect( page.locator( 'sc-menu-item:visible' ).filter( { hasText: 'Alpha Widget' } ).first() ).toBeVisible( { timeout: 10000 } );
		await expect( page.locator( 'sc-menu-item:visible' ).filter( { hasText: 'Alpha Device' } ).first() ).toBeVisible( { timeout: 10000 } );
		await expect( page.locator( 'sc-menu-item:visible' ).filter( { hasText: 'Beta Gadget' } ) ).toHaveCount( 0 );

		// Clear search — all 3 should be visible.
		await searchInput.clear();
		await page.waitForLoadState( 'networkidle' );
		const menuItems = page.locator( 'sc-menu-item:visible' );
		await expect( menuItems ).toHaveCount( 3, { timeout: 10000 } );
	} );

	test( 'ModelSelector search clears pagination state', async ( {
		page,
		requestUtils,
	} ) => {
		await Promise.all(
			Array.from( { length: 12 }, ( _, i ) =>
				createProduct( requestUtils, {
					name: `Paginate Product ${ String( i + 1 ).padStart( 2, '0' ) }`,
				} )
			)
		);

		await navigateToProductModelSelector( page );
		await openModelSelector( page );

		// Load page 2 via scroll.
		const menuItems = page.locator( 'sc-menu-item:visible' );
		await expect( menuItems ).toHaveCount( 10, { timeout: 10000 } );
		await page.locator( 'sc-card sc-select' ).nth( 2 ).evaluate(
			( el ) => el.dispatchEvent( new CustomEvent( 'scScrollEnd' ) )
		);
		await page.waitForLoadState( 'networkidle' );
		await expect( menuItems ).toHaveCount( 12, { timeout: 10000 } );

		// Search for a specific product.
		const modelSelectEl = page.locator( 'sc-card sc-select' ).nth( 2 );
		const searchInput = modelSelectEl.locator( 'input[placeholder="Search..."]' );
		await searchInput.waitFor( { timeout: 10000 } );
		await searchInput.fill( 'Paginate Product 12' );
		await page.waitForLoadState( 'networkidle' );
		await expect( menuItems ).toHaveCount( 1, { timeout: 10000 } );

		// Clear search — should reset to page 1 (10 items), not 12.
		await searchInput.clear();
		await page.waitForLoadState( 'networkidle' );
		await expect( menuItems ).toHaveCount( 10, { timeout: 10000 } );
	} );

	test( 'Page 2 product selection persists after save and reload (pinning)', async ( {
		page,
		requestUtils,
	} ) => {
		// Create 12 products in smaller batches to avoid API strain.
		for ( let batch = 0; batch < 3; batch++ ) {
			await Promise.all(
				Array.from( { length: 4 }, ( _, i ) => {
					const idx = batch * 4 + i + 1;
					return createProduct( requestUtils, {
						name: `Paginate Product ${ String( idx ).padStart( 2, '0' ) }`,
					} );
				} )
			);
		}

		await navigateToProductModelSelector( page );
		await openModelSelector( page );

		// Load page 2.
		const menuItems = page.locator( 'sc-menu-item:visible' );
		await expect( menuItems ).toHaveCount( 10, { timeout: 10000 } );
		await page.locator( 'sc-card sc-select' ).nth( 2 ).evaluate(
			( el ) => el.dispatchEvent( new CustomEvent( 'scScrollEnd' ) )
		);
		await page.waitForLoadState( 'networkidle' );
		await expect( menuItems ).toHaveCount( 12, { timeout: 10000 } );

		// Select "Paginate Product 12" (a page-2 product).
		const productItem = page.locator( 'sc-menu-item' ).filter( { hasText: 'Paginate Product 12' } ).first();
		await productItem.waitFor( { timeout: 15000 } );
		await productItem.click();

		// Save — click "Save & Publish" and wait for it to disappear (proves save completed).
		const saveBtn = page.locator( 'text=Save & Publish' );
		await saveBtn.waitFor( { timeout: 10000 } );
		await saveBtn.click();
		// Wait for button text to change from "Save & Publish" to "Update" — confirms save completed.
		await expect( saveBtn ).not.toBeVisible( { timeout: 30000 } );
		await page.waitForLoadState( 'networkidle' );

		// Reload and verify the page-2 product is still selected (pinning).
		await page.reload();
		await page.waitForLoadState( 'networkidle' );

		// Wait for conditions to render after reload.
		await page.locator( 'sc-card' ).first().waitFor( { timeout: 20000 } );

		const modelTrigger = page.locator( 'sc-card sc-select' ).nth( 2 );
		await modelTrigger.waitFor( { timeout: 15000 } );
		await expect( modelTrigger ).toContainText( 'Paginate Product 12', { timeout: 15000 } );
	} );
} );
