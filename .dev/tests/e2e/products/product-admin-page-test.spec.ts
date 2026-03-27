/**
 * External dependencies.
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies.
 */
import { PRODUCT_API_PATH } from '../request-utils/endpoints';
import { create as createAccount } from '../provisional-account';

test.describe('Product Admin Page', () => {
	test.beforeEach(async ({ requestUtils }) => {
		await createAccount(requestUtils);
	});

	test('Should render product list page', async ({ page }) => {
		await page.goto('/wp-admin/admin.php?page=sc-products');

		// Check if the page is loaded.
		await expect(page.locator('h1')).toHaveText('Products');

		// Check if the page has Add New button.
		await expect(page.locator('.page-title-action')).toHaveText('Add New');

		// Check if the page has products list table.
		await expect(page.locator('.wp-list-table')).toBeVisible();
	});

	test('Should create a new product', async ({ page }) => {
		await page.goto('/wp-admin/admin.php?page=sc-products');

		// Click on the create product list link by class - page-title-action
		await page.click('.page-title-action');

		// Fill the form
		await page.fill('input[name="name"]', 'Test Product');

		// Click on the create button
		await page.click('button[type="submit"]');

		// Check if the product is created with name and description by going to the edit page.
		await expect(page.locator('input[name="name"]')).toHaveValue(
			'Test Product'
		);
	});
});
