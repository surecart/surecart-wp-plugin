/**
 * External dependencies.
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies.
 */
import { create as createAccount } from '../provisional-account';

const LEARN_TAB_URL = '/wp-admin/admin.php?page=sc-settings&tab=learn';

const SECTION_TITLES = [
	'Set Up Store Basics',
	'Set Up Shipping',
	'Add Your First Product',
	'Connect Payment Processor',
	'Test Your Checkout & Go Live',
	'Customize Checkout Experience',
	'Manage Orders & Customers',
	'Grow Your Revenue',
];

test.describe( 'Learn Tab Settings Page', () => {
	test.beforeEach( async ( { requestUtils } ) => {
		await createAccount( requestUtils );
	} );

	test( 'Should render the Learn tab page', async ( { page } ) => {
		await page.goto( LEARN_TAB_URL );

		// Check the page heading is visible.
		await expect( page.getByRole( 'heading', { name: 'Setup Checklist' } ) ).toBeVisible();

		// Check the subtitle text is visible.
		await expect(
			page.getByText( 'Set up your store step by step and make your first sale with confidence.' )
		).toBeVisible();
	} );

	test( 'Should display all 8 learning sections', async ( { page } ) => {
		await page.goto( LEARN_TAB_URL );

		// Assert all 8 section titles are visible.
		for ( const title of SECTION_TITLES ) {
			await expect( page.getByRole( 'heading', { name: title } ) ).toBeVisible();
		}
	} );

	test( 'Should display Required and Optional badges', async ( { page } ) => {
		await page.goto( LEARN_TAB_URL );

		// Sections with "Required" badge: Store Basics, First Product, Payment Processor, Test Checkout.
		const requiredSections = [
			'Set Up Store Basics',
			'Add Your First Product',
			'Connect Payment Processor',
			'Test Your Checkout & Go Live',
		];

		for ( const title of requiredSections ) {
			const sectionHeader = page.getByRole( 'heading', { name: title } ).locator( '..' );
			await expect( sectionHeader.getByText( 'Required' ) ).toBeVisible();
		}

		// Shipping section has "Optional" badge.
		const shippingHeader = page.getByRole( 'heading', { name: 'Set Up Shipping' } ).locator( '..' );
		await expect( shippingHeader.getByText( 'Optional' ) ).toBeVisible();

		// Sections 6 & 7 have 'Recommended' badge.
		const recommendedSections = [
			'Customize Checkout Experience',
			'Manage Orders & Customers',
		];

		for ( const title of recommendedSections ) {
			const sectionHeader = page.getByRole( 'heading', { name: title } ).locator( '..' );
			await expect( sectionHeader.getByText( 'Recommended' ) ).toBeVisible();
		}

		// Grow Your Revenue has no badge.
		const growHeader = page.getByRole( 'heading', { name: 'Grow Your Revenue' } ).locator( '..' );
		await expect( growHeader.getByText( 'Required' ) ).not.toBeVisible();
		await expect( growHeader.getByText( 'Optional' ) ).not.toBeVisible();
		await expect( growHeader.getByText( 'Recommended' ) ).not.toBeVisible();
	} );

	test( 'Should expand and collapse sections', async ( { page } ) => {
		await page.goto( LEARN_TAB_URL );

		// First section should be expanded by default — its steps should be visible.
		await expect( page.getByText( 'Complete Setup' ).first() ).toBeVisible();

		// Click on "Set Up Shipping" section header to expand it.
		const shippingButton = page.getByRole( 'button', { name: /Set Up Shipping/i } );
		await shippingButton.click();

		// Shipping step should now be visible.
		await expect( page.getByText( 'Configure Shipping Zones & Rates' ) ).toBeVisible();

		// Click again to collapse.
		await shippingButton.click();

		// Shipping step should be hidden.
		await expect( page.getByText( 'Configure Shipping Zones & Rates' ) ).not.toBeVisible();
	} );

	test( 'Should display steps within expanded section', async ( { page } ) => {
		await page.goto( LEARN_TAB_URL );

		// First section is open by default — check its 3 steps.
		const expectedSteps = [ 'Complete Setup', 'Add Store Details', 'Add Brand Details' ];

		for ( const stepTitle of expectedSteps ) {
			await expect( page.getByText( stepTitle ).first() ).toBeVisible();
		}

		// Each step should have an action button.
		const firstSection = page.locator( '[aria-expanded="true"]' ).locator( '../..' );
		const actionButtons = firstSection.locator( 'sc-button' );
		await expect( actionButtons ).toHaveCount( 3 );
	} );

	test( 'Should have correct action button links', async ( { page } ) => {
		await page.goto( LEARN_TAB_URL );

		// "Complete Setup" should link externally to app.surecart.com/sign_up.
		const completeSetupButton = page.locator( 'sc-button:has-text("Set Up")' ).first();
		await expect( completeSetupButton ).toHaveAttribute( 'href', 'https://app.surecart.com/sign_up' );
		await expect( completeSetupButton ).toHaveAttribute( 'target', '_blank' );

		// Expand "Add Your First Product" section.
		const productButton = page.getByRole( 'button', { name: /Add Your First Product/i } );
		await productButton.click();

		// "Add Product" button should link to products page.
		const addProductButton = page.locator( 'sc-button:has-text("Add Product")' );
		await expect( addProductButton ).toHaveAttribute( 'href', /page=sc-products/ );
	} );

	test( 'Should have Learn How links on sections', async ( { page } ) => {
		await page.goto( LEARN_TAB_URL );

		// All sections should have a "Learn How" link.
		const learnHowLinks = page.locator( 'a:has-text("Learn How")' );
		await expect( learnHowLinks ).toHaveCount( 8 );

		// Each link should open in a new tab.
		const firstLink = learnHowLinks.first();
		await expect( firstLink ).toHaveAttribute( 'target', '_blank' );

		// Links should point to surecart.com/docs.
		await expect( firstLink ).toHaveAttribute( 'href', /surecart\.com\/docs/ );
	} );

	test( 'Should display progress counts', async ( { page } ) => {
		await page.goto( LEARN_TAB_URL );

		// Each section should show a progress badge in "completed/total" format.
		// The first section has 3 steps, so expect "X/3" format.
		const storeBasicsHeader = page.getByRole( 'heading', { name: 'Set Up Store Basics' } ).locator( '..' );
		await expect( storeBasicsHeader.getByText( /\d+\/3/ ) ).toBeVisible();

		// Shipping has 1 step.
		const shippingHeader = page.getByRole( 'heading', { name: 'Set Up Shipping' } ).locator( '..' );
		await expect( shippingHeader.getByText( /\d+\/1/ ) ).toBeVisible();

		// "Add Your First Product" has 3 steps.
		const productHeader = page.getByRole( 'heading', { name: 'Add Your First Product' } ).locator( '..' );
		await expect( productHeader.getByText( /\d+\/3/ ) ).toBeVisible();

		// "Grow Your Revenue" has 7 steps.
		const revenueHeader = page.getByRole( 'heading', { name: 'Grow Your Revenue' } ).locator( '..' );
		await expect( revenueHeader.getByText( /\d+\/7/ ) ).toBeVisible();
	} );

	test( 'Should toggle step checkbox and persist', async ( { page, requestUtils } ) => {
		await page.goto( LEARN_TAB_URL );

		// Expand "Add Your First Product" section.
		const productButton = page.getByRole( 'button', { name: /Add Your First Product/i } );
		await productButton.click();

		// Click the checkbox for "Add Product Variants" (manual step, not auto-detected).
		const variantsCheckbox = page.getByRole( 'checkbox', { name: 'Add Product Variants' } );
		await variantsCheckbox.waitFor( { state: 'visible' } );
		await variantsCheckbox.click( { force: true } );

		// Assert the checkbox is now checked.
		await expect( variantsCheckbox ).toHaveAttribute( 'aria-checked', 'true' );

		// Reload the page and verify persistence.
		await page.reload();

		// Re-expand the section.
		const productButtonAfterReload = page.getByRole( 'button', { name: /Add Your First Product/i } );
		await productButtonAfterReload.click();

		// The checkbox should still be checked after reload.
		const variantsCheckboxAfterReload = page.getByRole( 'checkbox', { name: 'Add Product Variants' } );
		await expect( variantsCheckboxAfterReload ).toHaveAttribute( 'aria-checked', 'true' );

		// Clean up: reset progress so other tests aren't affected.
		await requestUtils.rest( {
			method: 'PUT',
			path: '/surecart/v1/learn-progress',
			data: {
				completed_steps: [],
			},
		} );
	} );

	test( 'Should show info tooltips on hover', async ( { page } ) => {
		await page.goto( LEARN_TAB_URL );

		// The "Add Store Details" step has an info tooltip.
		// Hover over the info icon next to it.
		const infoIcon = page.locator( 'sc-icon[name="info"]' ).first();
		await infoIcon.hover();

		// Tooltip text should become visible.
		await expect(
			page.getByText( 'Configure your store name, business address, currency, and other foundational settings.' )
		).toBeVisible();
	} );

	test( 'REST API - learn progress endpoint', async ( { requestUtils } ) => {
		// GET should return empty completed_steps initially.
		const getResponse = await requestUtils.rest( {
			method: 'GET',
			path: '/surecart/v1/learn-progress',
		} );
		expect( getResponse ).toHaveProperty( 'completed_steps' );
		expect( Array.isArray( getResponse.completed_steps ) ).toBe( true );

		// PUT to save a completed step.
		const putResponse = await requestUtils.rest( {
			method: 'PUT',
			path: '/surecart/v1/learn-progress',
			data: {
				completed_steps: [ 'add-product-variants' ],
			},
		} );
		expect( putResponse ).toHaveProperty( 'completed_steps' );
		expect( putResponse.completed_steps ).toContain( 'add-product-variants' );

		// GET again to confirm persistence.
		const getAfterPost = await requestUtils.rest( {
			method: 'GET',
			path: '/surecart/v1/learn-progress',
		} );
		expect( getAfterPost.completed_steps ).toContain( 'add-product-variants' );

		// Clean up: reset progress.
		await requestUtils.rest( {
			method: 'PUT',
			path: '/surecart/v1/learn-progress',
			data: {
				completed_steps: [],
			},
		} );
	} );
} );
