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
	'Add Your First Product',
	'Customize Checkout Experience',
	'Set Up Shipping',
	'Test Your Checkout & Go Live',
	'Manage Orders & Customers',
	'Grow Your Revenue',
];

/**
 * Helper to reset learn completed steps via site settings REST API.
 */
async function resetLearnSteps( requestUtils ) {
	await requestUtils.rest( {
		method: 'POST',
		path: '/wp/v2/settings',
		data: {
			surecart_learn_completed_steps: [],
		},
	} );
}

/**
 * Helper to find the sc-checkbox within a step row identified by its title.
 */
function getStepCheckbox( page, stepTitle: string ) {
	return page
		.locator( 'div' )
		.filter( { has: page.getByText( stepTitle, { exact: true } ) } )
		.locator( 'sc-checkbox' )
		.first();
}

/**
 * Helper to find a step row by its title.
 * Uses div:has(> sc-checkbox) to match only the step container div
 * (which has sc-checkbox as a direct child), not any ancestor div.
 */
function getStepRow( page, stepTitle: string ) {
	return page
		.locator( 'div:has(> sc-checkbox)' )
		.filter( { has: page.getByText( stepTitle, { exact: true } ) } )
		.first();
}

/**
 * Navigate to the Learn tab and wait for the page to be fully loaded.
 * Waits for the first section heading to appear, which indicates the site entity
 * and product queries have resolved (spinner is gone, content is ready).
 */
async function gotoAndWaitForLearnTab( page ) {
	await page.goto( LEARN_TAB_URL );
	await page.getByRole( 'heading', { name: 'Set Up Store Basics' } ).waitFor( { state: 'visible' } );
}

test.describe( 'Learn Tab Settings Page', () => {
	test.beforeEach( async ( { requestUtils } ) => {
		await createAccount( requestUtils );
		await resetLearnSteps( requestUtils );
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

	test( 'Should display all 7 learning sections', async ( { page } ) => {
		await page.goto( LEARN_TAB_URL );

		// Expand completed accordion if any sections are already completed.
		const completedToggle = page.getByRole( 'button', { name: /Completed \(\d+\)/i } );
		if ( await completedToggle.isVisible().catch( () => false ) ) {
			await completedToggle.click();
		}

		// Assert all 7 section titles are visible.
		for ( const title of SECTION_TITLES ) {
			await expect( page.getByRole( 'heading', { name: title } ) ).toBeVisible();
		}
	} );

	test( 'Should display Required and Optional badges', async ( { page } ) => {
		await page.goto( LEARN_TAB_URL );

		// Sections with "Required" badge: Store Basics, First Product, Test Checkout.
		const requiredSections = [
			'Set Up Store Basics',
			'Add Your First Product',
			'Test Your Checkout & Go Live',
		];

		for ( const title of requiredSections ) {
			const sectionHeader = page.getByRole( 'heading', { name: title } ).locator( '..' );
			await expect( sectionHeader.getByText( 'Required' ) ).toBeVisible();
		}

		// Shipping section has "Optional" badge.
		const shippingHeader = page.getByRole( 'heading', { name: 'Set Up Shipping' } ).locator( '..' );
		await expect( shippingHeader.getByText( 'Optional' ) ).toBeVisible();

		// Sections with 'Recommended' badge.
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

		// First section is open by default — check its key steps are visible.
		const expectedSteps = [ 'Complete Setup', 'Connect Payment Gateway', 'Add Store Details', 'Add Brand Details', 'Customer Dashboard Page', 'Configure Tax Settings', 'Set Up Transactional Emails', 'Add Privacy Policy & Terms of Service' ];

		for ( const stepTitle of expectedSteps ) {
			await expect( page.getByText( stepTitle ).first() ).toBeVisible();
		}

		// "Add Store Details" is always manual — verify it has an action button.
		const storeDetailsRow = getStepRow( page, 'Add Store Details' );
		await expect( storeDetailsRow.locator( 'sc-button' ) ).toHaveCount( 1 );
	} );

	test( 'Should have correct action button links', async ( { page } ) => {
		await page.goto( LEARN_TAB_URL );

		// "Add Store Details" should link to settings page.
		const storeDetailsRow = getStepRow( page, 'Add Store Details' );
		const storeDetailsButton = storeDetailsRow.locator( 'sc-button' );
		await expect( storeDetailsButton ).toHaveAttribute( 'href', 'admin.php?page=sc-settings' );

		// Expand "Add Your First Product" section.
		const productButton = page.getByRole( 'button', { name: /Add Your First Product/i } );
		await productButton.click();

		// "Add Product" button should link to products page.
		const addProductButton = page.locator( 'sc-button:has-text("Add Product")' );
		await expect( addProductButton ).toHaveAttribute( 'href', /page=sc-products/ );
	} );

	test( 'Should have Learn How links on sections', async ( { page } ) => {
		await page.goto( LEARN_TAB_URL );

		// All 7 sections have a "Learn How" link.
		// "Learn How" is rendered as ScButton (sc-button), not a plain <a>.
		const learnHowLinks = page.locator( 'sc-button:has-text("Learn How")' );
		await expect( learnHowLinks ).toHaveCount( 7 );

		// Each link should open in a new tab.
		const firstLink = learnHowLinks.first();
		await expect( firstLink ).toHaveAttribute( 'target', '_blank' );

		// Links should point to surecart.com/docs.
		await expect( firstLink ).toHaveAttribute( 'href', /surecart\.com\/docs/ );
	} );

	test( 'Should display progress counts', async ( { page } ) => {
		await page.goto( LEARN_TAB_URL );

		// Each section should show a progress badge in "completed/total" format.
		// The first section has 7 steps, so expect "X/7" format.
		const storeBasicsHeader = page.getByRole( 'heading', { name: 'Set Up Store Basics' } ).locator( '..' );
		await expect( storeBasicsHeader.getByText( /\d+\/8/ ) ).toBeVisible();

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
		// Navigate and wait for full page load so toggleStep works.
		await gotoAndWaitForLearnTab( page );

		// Expand "Add Your First Product" section.
		const productButton = page.getByRole( 'button', { name: /Add Your First Product/i } );
		await productButton.click();

		// Click the checkbox for "Add Product Variants" (manual step, not auto-detected).
		const variantsCheckbox = getStepCheckbox( page, 'Add Product Variants' );
		await variantsCheckbox.waitFor( { state: 'visible' } );
		await variantsCheckbox.click();

		// Assert the checkbox is now checked.
		await expect( variantsCheckbox ).toHaveAttribute( 'checked', '' );

		// Reload the page and verify persistence.
		await page.reload();

		// Re-expand the section.
		const productButtonAfterReload = page.getByRole( 'button', { name: /Add Your First Product/i } );
		await productButtonAfterReload.click();

		// The checkbox should still be checked after reload.
		const variantsCheckboxAfterReload = getStepCheckbox( page, 'Add Product Variants' );
		await expect( variantsCheckboxAfterReload ).toHaveAttribute( 'checked', '' );
	} );

	test( 'Should show info tooltips on click', async ( { page } ) => {
		await gotoAndWaitForLearnTab( page );

		// The "Add Store Details" step has an info tooltip via HelpTooltip (Popover).
		// Click the tooltip trigger wrapper (parent of sc-icon) to toggle the popover.
		// We target the wrapper div because sc-icon is a shadow-DOM web component
		// and mouseenter doesn't bubble, making hover unreliable in Playwright.
		const infoIcon = page.locator( 'sc-icon[name="info"]' ).first();
		await infoIcon.click();

		// Tooltip text should become visible.
		await expect(
			page.getByText( 'Configure your store name, business address, currency, and other foundational settings.' )
		).toBeVisible();
	} );

	test( 'Should auto-detect completed steps from scData', async ( { page } ) => {
		await page.goto( LEARN_TAB_URL );

		// "Complete Setup" has autoDetect: 'hasApiToken' — account_id exists after createAccount().
		const completeSetupCheckbox = getStepCheckbox( page, 'Complete Setup' );
		await expect( completeSetupCheckbox ).toHaveAttribute( 'checked', '' );
	} );

	test( 'Should not allow toggling auto-detected steps', async ( { page } ) => {
		await page.goto( LEARN_TAB_URL );

		// "Complete Setup" is auto-detected — it should be disabled.
		const completeSetupCheckbox = getStepCheckbox( page, 'Complete Setup' );
		await expect( completeSetupCheckbox ).toHaveAttribute( 'checked', '' );
		await expect( completeSetupCheckbox ).toHaveAttribute( 'disabled', '' );
	} );

	test( 'Should show Learn submenu item in admin menu', async ( { page } ) => {
		await page.goto( '/wp-admin/' );

		// Open SureCart menu and find the Learn submenu link.
		const learnLink = page.locator( '#toplevel_page_sc-dashboard a[href*="tab=learn"]' );
		await expect( learnLink ).toBeVisible();
		await expect( learnLink ).toContainText( 'Learn' );
	} );

	test( 'Should highlight Learn submenu when on learn tab', async ( { page } ) => {
		await page.goto( LEARN_TAB_URL );

		// The Learn submenu item should have the "current" class.
		const learnMenuItem = page.locator( '#toplevel_page_sc-dashboard a[href*="tab=learn"]' ).locator( '..' );
		await expect( learnMenuItem ).toHaveClass( /current/ );
	} );

	test( 'Should not render action button for steps without actionUrl', async ( { page } ) => {
		await page.goto( LEARN_TAB_URL );

		// Expand "Test Your Checkout & Go Live" section.
		await page.getByRole( 'button', { name: /Test Your Checkout/i } ).click();

		// "Make a Test Payment" step has no actionUrl — verify no button in that step row.
		const testPaymentRow = getStepRow( page, 'Make a Test Payment' );
		await expect( testPaymentRow.locator( 'sc-button' ) ).toHaveCount( 0 );
	} );

	test( 'Should show loading spinner initially', async ( { page } ) => {
		// Intercept the product API to delay the response.
		await page.route( '**/surecart/v1/products**', async ( route ) => {
			await new Promise( ( resolve ) => setTimeout( resolve, 2000 ) );
			await route.continue();
		} );

		await page.goto( LEARN_TAB_URL );

		// Spinner should be visible while products are loading.
		await expect( page.locator( 'sc-spinner' ) ).toBeVisible();

		// After products load, sections should appear.
		await expect( page.getByRole( 'heading', { name: 'Set Up Store Basics' } ) ).toBeVisible( { timeout: 10000 } );
	} );

	test( 'Should update progress badge when section steps are completed', async ( { page, requestUtils } ) => {
		// Mark "test-payment" step as completed via REST API.
		await requestUtils.rest( {
			method: 'POST',
			path: '/wp/v2/settings',
			data: {
				surecart_learn_completed_steps: [ 'test-payment' ],
			},
		} );

		await page.goto( LEARN_TAB_URL );

		try {
			// "Test Your Checkout" section is now fully complete (1/1)
			// and should be in the completed accordion.
			const completedToggle = page.getByRole( 'button', { name: /Completed \(\d+\)/i } );
			await expect( completedToggle ).toBeVisible();
			await completedToggle.click();

			// The progress badge should show "1/1".
			const sectionHeader = page.getByRole( 'heading', { name: 'Test Your Checkout & Go Live' } ).locator( '..' );
			await expect( sectionHeader.getByText( '1/1' ) ).toBeVisible();
		} finally {
			await resetLearnSteps( requestUtils );
		}
	} );

	test( 'Should move completed sections into collapsed accordion', async ( { page, requestUtils } ) => {
		// Mark "test-payment" step as completed via REST API to create a fully complete section.
		await requestUtils.rest( {
			method: 'POST',
			path: '/wp/v2/settings',
			data: {
				surecart_learn_completed_steps: [ 'test-payment' ],
			},
		} );

		await page.goto( LEARN_TAB_URL );

		try {
			// Completed accordion should now appear, collapsed by default.
			const completedToggle = page.getByRole( 'button', { name: /Completed \(\d+\)/i } );
			await expect( completedToggle ).toBeVisible();
			await expect( completedToggle ).toHaveAttribute( 'aria-expanded', 'false' );

			// The section heading should not be visible while accordion is collapsed.
			await expect( page.getByRole( 'heading', { name: 'Test Your Checkout & Go Live' } ) ).not.toBeVisible();

			// Expand the accordion.
			await completedToggle.click();
			await expect( completedToggle ).toHaveAttribute( 'aria-expanded', 'true' );

			// The completed section should now be visible inside.
			await expect( page.getByRole( 'heading', { name: 'Test Your Checkout & Go Live' } ) ).toBeVisible();
		} finally {
			await resetLearnSteps( requestUtils );
		}
	} );

	test( 'Should display Customer Dashboard Page step in Store Basics section', async ( { page } ) => {
		await gotoAndWaitForLearnTab( page );

		// "Customer Dashboard Page" should be visible in the first (already expanded) section.
		await expect( page.getByText( 'Customer Dashboard Page' ).first() ).toBeVisible();
		await expect(
			page.getByText( 'Customize the page your customers land on after completing a purchase.' )
		).toBeVisible();

		// It should have a "Set Up" action button linking to the dashboard page editor.
		const dashboardRow = getStepRow( page, 'Customer Dashboard Page' );
		const dashboardButton = dashboardRow.locator( 'sc-button' );
		await expect( dashboardButton ).toContainText( 'Set Up' );
	} );

	test( 'Should link Customer Portal step to subscription settings', async ( { page } ) => {
		await gotoAndWaitForLearnTab( page );

		// Expand "Manage Orders & Customers" section.
		await page.getByRole( 'button', { name: /Manage Orders & Customers/i } ).click();

		// "Set Up Customer Portal" should have "Configure Portal" button linking to subscription settings.
		const portalRow = getStepRow( page, 'Set Up Customer Portal' );
		const portalButton = portalRow.locator( 'sc-button' );
		await expect( portalButton ).toContainText( 'Configure Portal' );
		await expect( portalButton ).toHaveAttribute( 'href', 'admin.php?page=sc-settings&tab=subscription_protocol' );
	} );

	test( 'Should open action links in new tab', async ( { page } ) => {
		await page.goto( LEARN_TAB_URL );

		// "Add Store Details" action button should open in a new tab.
		const storeDetailsRow = getStepRow( page, 'Add Store Details' );
		const storeDetailsButton = storeDetailsRow.locator( 'sc-button' );
		await expect( storeDetailsButton ).toHaveAttribute( 'target', '_blank' );
		await expect( storeDetailsButton ).toHaveAttribute( 'rel', 'noopener noreferrer' );
	} );

} );
