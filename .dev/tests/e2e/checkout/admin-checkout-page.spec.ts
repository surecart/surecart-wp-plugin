/**
 * External dependencies.
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies.
 */
import { create as createAccount } from '../provisional-account';

test.describe('Admin checkouts page', () => {
	test.beforeEach(async ({ requestUtils }) => {
		await createAccount(requestUtils);
	});

	test('Checkout id is created when the page is visited..', async ({
		page,
	}) => {
		await page.goto('/wp-admin/admin.php?page=sc-checkouts');
		// Wait for the page to load.
		await page.waitForLoadState('networkidle');
		const urlParams = new URLSearchParams(page.url());
		expect(urlParams.has('id')).toBe(true);
	});
});
