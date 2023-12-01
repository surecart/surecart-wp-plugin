/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

const API_BASE_PATH = '/surecart/v1/products';
const API_PRODUCT_COLLECTION_BASE_PATH = '/surecart/v1/product_collections';

test.describe('Product Admin Page', () => {
	let productCollection = null;

	test.beforeAll(async ({ requestUtils }) => {
		// Create a product collection using REST API to use later.
		productCollection = await requestUtils.rest({
			method: 'POST',
			path: API_PRODUCT_COLLECTION_BASE_PATH,
			data: {
				name: 'Test Product Collection For Product Linking',
			},
		});
	});

	test('Should render product list page', async ({ page }) => {
		await page.goto('/wp-admin/admin.php?page=sc-products');

		// Check if the page is loaded.
		await expect(page.locator('h1')).toHaveText('Products');

		// Check if the page has Add New button.
		await expect(page.locator('.page-title-action')).toHaveText('Add New');

		// Check if the page has product collection table.
		await expect(page.locator('.wp-list-table')).toBeVisible();
	});

	test('Should create a new product', async ({ page }) => {
		await page.goto('/wp-admin/admin.php?page=sc-products');

		// Click on the create product collection link by class - page-title-action
		await page.click('.page-title-action');

		// Fill the form
		await page.fill('input[name="name"]', 'Test Product');

		// Click on the create button
		await page.click('button[type="submit"]');

		// Check if the collection is created with name and description by going to the edit page.
		await expect(page.locator('input[name="name"]')).toHaveValue(
			'Test Product'
		);
	});

	test('Should edit a product', async ({ page, requestUtils }) => {
		// Create a product collection using REST API.
		const collection = await requestUtils.rest({
			method: 'POST',
			path: API_BASE_PATH,
			data: {
				name: 'Edit Product',
			},
		});

		await page.goto(
			`/wp-admin/admin.php?page=sc-products&action=edit&id=${collection.id}`
		);

		// Check if the collection is created with name by going to the edit page.
		await expect(page.locator('#input-4')).toHaveValue('Edit Product');

		// Fill the form.
		await page.fill('#input-4', 'Edit Product Updated');

		// Click on the save button.
		await page.getByRole('button', { name: 'Save Product' }).click();

		// Wait for the page to load.
		await page.waitForLoadState('networkidle');

		// Check if the collection is created with name by going to the edit page.
		await expect(
			page.locator('.components-snackbar__content')
		).toBeVisible();

		// Check if the collection is created with name by going to the edit page.
		await expect(page.locator('#input-4')).toHaveValue(
			'Edit Product Updated'
		);
	});
});
