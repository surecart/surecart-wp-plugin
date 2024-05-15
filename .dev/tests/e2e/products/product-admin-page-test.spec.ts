/**
 * External dependencies.
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies.
 */
import { PRODUCT_API_PATH } from '../request-utils/endpoints';
import { createProvisionalAccount } from '../provisional-account-opening';

test.describe('Product Admin Page', () => {
	test.beforeEach(async ({ requestUtils }) => {
		await createProvisionalAccount(requestUtils);
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

	test('Should edit a product', async ({ page, requestUtils }) => {
		// Create a product using REST API.
		const product = await requestUtils.rest({
			method: 'POST',
			path: PRODUCT_API_PATH,
			data: {
				name: 'Edit Product',
			},
		});

		await page.goto(
			`/wp-admin/admin.php?page=sc-products&action=edit&id=${product.id}`
		);

		// Check if the product is created with name by going to the edit page.
		await expect(page.locator('#input-5')).toHaveValue('Edit Product');

		// Fill the form.
		await page.fill('#input-5', 'Edit Product Updated');

		// Click on the save button.
		await page.getByRole('button', { name: 'Save Product' }).click();

		// Wait for the page to load.
		await page.waitForLoadState('networkidle');

		// Check if the product is created with name by going to the edit page.
		await expect(
			page.locator('.components-snackbar__content')
		).toBeVisible();

		// Check if the product is created with name by going to the edit page.
		await expect(page.locator('#input-5')).toHaveValue(
			'Edit Product Updated'
		);
	});
});
