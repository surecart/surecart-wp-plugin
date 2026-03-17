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
 * Returns once the edit page loads (with conditions section visible).
 */
async function createDynamicPrice( page, name: string ) {
	// Fill Name.
	const nameInput = page.locator( 'sc-input[label="Name"]' );
	await nameInput.waitFor( { timeout: 15000 } );
	await nameInput.locator( 'input' ).fill( name );

	// Fill Display Name.
	const displayNameInput = page.locator( 'sc-input[label="Display Name"]' );
	await displayNameInput.locator( 'input' ).fill( `${ name } Display` );

	// Select "Start from scratch" recipe.
	const startFromScratch = page.locator( 'sc-choice' ).filter( { hasText: 'Start from scratch' } );
	await startFromScratch.click();

	// Select "Line Item" target.
	const lineItemChoice = page.locator( 'sc-choice' ).filter( { hasText: 'Line Item' } );
	await lineItemChoice.click();

	// Select "All transactions" radio.
	const allTransactions = page.locator( 'sc-radio' ).filter( { hasText: 'All transactions' } );
	await allTransactions.click();

	// Click Continue to submit.
	const continueBtn = page.locator( 'sc-button[submit]' );
	await continueBtn.click();

	// Wait for redirect to Edit page — the Conditions section should appear.
	await page.waitForLoadState( 'networkidle' );
	await page.locator( 'text=Conditions' ).first().waitFor( { timeout: 15000 } );
}

/**
 * Helper: click "Add Conditions" on the edit page (empty state).
 */
async function addConditions( page ) {
	const addBtn = page.locator( 'sc-button' ).filter( { hasText: 'Add Conditions' } );
	await addBtn.waitFor( { timeout: 10000 } );
	await addBtn.click();
}

/**
 * Helper: select an attribute in the first condition's attribute dropdown.
 * The attribute dropdown is the first sc-select with placeholder "Select an attribute".
 * Types into the search input to filter, then clicks the first matching menu item.
 */
async function selectAttribute( page, attributeLabel: string ) {
	const attributeSelect = page.locator( 'sc-select[placeholder="Select an attribute"]' ).first();
	await attributeSelect.waitFor( { timeout: 10000 } );
	await attributeSelect.click();

	// The sc-select search input has placeholder "Search..." — wait for it to appear.
	const searchInput = page.locator( 'input[placeholder="Search..."]' ).first();
	await searchInput.waitFor( { timeout: 5000 } );
	await searchInput.fill( attributeLabel );

	// Click the first visible matching menu item from the filtered dropdown.
	const menuItem = page.locator( 'sc-menu-item:visible' ).filter( { hasText: attributeLabel } ).first();
	await menuItem.waitFor( { timeout: 10000 } );
	await menuItem.click();
}

test.describe( 'Dynamic Pricing Selectors', () => {
	test.beforeEach( async ( { requestUtils } ) => {
		await createAccount( requestUtils );
	} );

	test( 'ModelSelector appears for uuid product attribute', async ( {
		page,
		requestUtils,
	} ) => {
		// Create a test product.
		await createProduct( requestUtils, { name: 'Selector Test Product' } );

		// Navigate to create new dynamic price.
		await page.goto( AUTO_FEES_PAGE );
		await page.waitForLoadState( 'networkidle' );

		// Click add new.
		await page.locator( '.page-title-action' ).click();
		await page.waitForLoadState( 'networkidle' );

		// Fill the create form and submit to get to edit page.
		await createDynamicPrice( page, 'Test Model Selector' );

		// Click "Add Conditions".
		await addConditions( page );

		// Select "Product" attribute — this should render a ModelSelector (sc-select).
		await selectAttribute( page, 'Product' );

		// Verify a third sc-select appears (the ModelSelector value input).
		// The condition row should now have 3 sc-selects: attribute, operator, and value (ModelSelector).
		const scSelects = page.locator( 'sc-card sc-select' );
		await expect( scSelects ).toHaveCount( 3, { timeout: 10000 } );
	} );

	test( 'PriceSelector appears for uuid price attribute', async ( {
		page,
		requestUtils,
	} ) => {
		await createProduct( requestUtils, { name: 'Price Selector Test' } );

		await page.goto( AUTO_FEES_PAGE );
		await page.waitForLoadState( 'networkidle' );
		await page.locator( '.page-title-action' ).click();
		await page.waitForLoadState( 'networkidle' );

		await createDynamicPrice( page, 'Test Price Selector' );
		await addConditions( page );

		// Select "Price" attribute — this should render a PriceSelector (sc-select).
		await selectAttribute( page, 'Price' );

		// Verify a third sc-select appears (the PriceSelector value input).
		const scSelects = page.locator( 'sc-card sc-select' );
		await expect( scSelects ).toHaveCount( 3, { timeout: 10000 } );
	} );

	test( 'ModelSelector shows selected product after page reload', async ( {
		page,
		requestUtils,
	} ) => {
		const product = await createProduct( requestUtils, {
			name: 'Persist Test Product',
		} );

		await page.goto( AUTO_FEES_PAGE );
		await page.waitForLoadState( 'networkidle' );
		await page.locator( '.page-title-action' ).click();
		await page.waitForLoadState( 'networkidle' );

		await createDynamicPrice( page, 'Test Persist Model' );
		await addConditions( page );
		await selectAttribute( page, 'Product' );

		// Select the operator "is".
		const operatorSelect = page.locator( 'sc-select[placeholder="Select a condition"]' ).first();
		await operatorSelect.waitFor( { timeout: 10000 } );
		await operatorSelect.click();
		// Use value attribute to precisely target "is" (not "is_not", "is_more_than", etc.)
		const isMenuItem = page.locator( 'sc-menu-item[value="is"]' ).first();
		await isMenuItem.waitFor( { timeout: 5000 } );
		await isMenuItem.click();

		// Wait for the ModelSelector to render after attribute + operator are set.
		const modelSelect = page.locator( 'sc-card sc-select' ).nth( 2 );
		await modelSelect.waitFor( { timeout: 10000 } );
		await modelSelect.click();
		await page.waitForLoadState( 'networkidle' );

		// Select the test product from the dropdown.
		const productItem = page.locator( 'sc-menu-item' ).filter( { hasText: 'Persist Test Product' } ).first();
		await productItem.waitFor( { timeout: 15000 } );
		await productItem.click();

		// Save the dynamic price via "Save & Publish" button in the header.
		const saveBtn = page.locator( 'text=Save & Publish' );
		await saveBtn.waitFor( { timeout: 10000 } );
		await saveBtn.click();
		// Wait for button to disappear (proves save completed — text changes to "Update").
		await expect( saveBtn ).not.toBeVisible( { timeout: 30000 } );
		await page.waitForLoadState( 'networkidle' );

		// Reload the page and wait for conditions to render.
		await page.reload();
		await page.waitForLoadState( 'networkidle' );
		await page.locator( 'sc-card' ).first().waitFor( { timeout: 20000 } );

		// If conditions didn't load (transient API fetch error), retry reload once.
		const modelTrigger = page.locator( 'sc-card sc-select' ).nth( 2 );
		if ( ! await modelTrigger.isVisible( { timeout: 5000 } ).catch( () => false ) ) {
			await page.reload();
			await page.waitForLoadState( 'networkidle' );
			await page.locator( 'sc-card' ).first().waitFor( { timeout: 20000 } );
		}

		// Verify the ModelSelector trigger shows the product name (not placeholder "Search...").
		await modelTrigger.waitFor( { timeout: 15000 } );
		await expect( modelTrigger ).toContainText( 'Persist Test Product', { timeout: 15000 } );
	} );

	test( 'PriceSelector shows selected price after page reload', async ( {
		page,
		requestUtils,
	} ) => {
		const product = await createProduct( requestUtils, {
			name: 'Price Persist Product',
		} );

		await page.goto( AUTO_FEES_PAGE );
		await page.waitForLoadState( 'networkidle' );
		await page.locator( '.page-title-action' ).click();
		await page.waitForLoadState( 'networkidle' );

		await createDynamicPrice( page, 'Test Persist Price' );
		await addConditions( page );
		await selectAttribute( page, 'Price' );

		// Select the operator "is".
		const operatorSelect = page.locator( 'sc-select[placeholder="Select a condition"]' ).first();
		await operatorSelect.waitFor( { timeout: 10000 } );
		await operatorSelect.click();
		// Use value attribute to precisely target "is" (not "is_not", "is_more_than", etc.)
		const isMenuItem = page.locator( 'sc-menu-item[value="is"]' ).first();
		await isMenuItem.waitFor( { timeout: 5000 } );
		await isMenuItem.click();

		// Wait for the PriceSelector to render after attribute + operator are set.
		const priceSelect = page.locator( 'sc-card sc-select' ).nth( 2 );
		await priceSelect.waitFor( { timeout: 10000 } );
		await priceSelect.click();
		await page.waitForLoadState( 'networkidle' );

		// PriceSelector groups items by product. Click the first sc-menu-item (the price).
		// The dropdown shows product name as sc-menu-label, prices as sc-menu-item below it.
		const priceItem = page.locator( 'sc-menu-item' ).filter( { hasText: /\$/ } ).first();
		await priceItem.waitFor( { timeout: 15000 } );
		await priceItem.click();

		// Save the dynamic price via "Save & Publish" button in the header.
		const saveBtn = page.locator( 'text=Save & Publish' );
		await saveBtn.waitFor( { timeout: 10000 } );
		await saveBtn.click();
		// Wait for button to disappear (proves save completed — text changes to "Update").
		await expect( saveBtn ).not.toBeVisible( { timeout: 30000 } );
		await page.waitForLoadState( 'networkidle' );

		// Reload the page and wait for conditions to render.
		await page.reload();
		await page.waitForLoadState( 'networkidle' );
		await page.locator( 'sc-card' ).first().waitFor( { timeout: 20000 } );

		// If conditions didn't load (transient API fetch error), retry reload once.
		const priceTrigger = page.locator( 'sc-card sc-select' ).nth( 2 );
		if ( ! await priceTrigger.isVisible( { timeout: 5000 } ).catch( () => false ) ) {
			await page.reload();
			await page.waitForLoadState( 'networkidle' );
			await page.locator( 'sc-card' ).first().waitFor( { timeout: 20000 } );
		}

		// Verify the PriceSelector trigger shows the price info after reload.
		await priceTrigger.waitFor( { timeout: 15000 } );
		await expect( priceTrigger ).toContainText( 'Price Persist Product', { timeout: 15000 } );
	} );
} );
