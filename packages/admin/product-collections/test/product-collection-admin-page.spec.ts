/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

const API_BASE_PATH = '/surecart/v1/product_collections';

test.describe('Product Collection Admin Page', () => {
	test.beforeEach(async ({ requestUtils }) => {
		const collections = await requestUtils.rest({
			path: API_BASE_PATH,
			params: {
				per_page: 100,
			},
		});

		// Delete all one by one.
		await Promise.all(
			collections.map((collection) =>
				requestUtils.rest({
					method: 'DELETE',
					path: `${API_BASE_PATH}/${collection.id}`,
				})
			)
		);
	});

	test('Should render product collection list page', async ({ page }) => {
		page.goto('/wp-admin/admin.php?page=sc-product-collections');

		// Check if the page is loaded.
		await expect(page.locator('h1')).toHaveText('Collections');

		// Check if the page has Add New button.
		await expect(page.locator('.page-title-action')).toHaveText('Add New');

		// Check if the page has product collection table.
		await expect(page.locator('.wp-list-table')).toBeVisible();
	});

	test('Should create a new product collection using REST API', async ({ requestUtils }) => {
		// Create a new product collection using REST API.
		await requestUtils.rest({
			method: 'POST',
			path: API_BASE_PATH,
			data: {
				name: 'Test Product Collection',
			},
		});

		// Count the number of product collections created.
		const collections = await requestUtils.rest({
			path: API_BASE_PATH,
			params: {
				per_page: 100,
			},
		});

		// Check if the collection is created and should have only one collection with name 'Test Product Collection'.
		expect(collections).toHaveLength(1);
		expect(collections[0].name).toBe('Test Product Collection');
	});

	test('Should update product collection using REST API', async ({ requestUtils }) => {
		// Create a product collection using REST API.
		const collection = await requestUtils.rest({
			method: 'POST',
			path: API_BASE_PATH,
			data: {
				name: 'Test Product Collection',
			},
		});

		// Now Update the product collection using REST API.
		await requestUtils.rest({
			method: 'PATCH',
			path: `${API_BASE_PATH}/${collection.id}`,
			data: {
				name: 'Test Product Collection Updated',
			},
		});

		// Count the number of product collections created.
		const collections = await requestUtils.rest({
			path: API_BASE_PATH,
			params: {
				per_page: 100,
			},
		});

		// Check if the collection is uppdated with name 'Test Product Collection Updated'.
		expect(collections[0].name).toBe('Test Product Collection Updated');
	});

	test('Should create a new product collection', async ({ page }) => {
		page.goto('/wp-admin/admin.php?page=sc-product-collections');

		// Click on the create product collection link by class - page-title-action
		await page.click('.page-title-action');

		// Check if Create Collection page is loaded.
		await expect(page.locator('.components-card-header', { hasText: 'Create Collection' })).toBeVisible();

		// Fill the form.
		await page.fill('input[name="name"]', 'Test Product Collection');

		// Click on the create button.
		await page.click('button[type="submit"]');

		// Check if the collection is created with name and description by going to the edit page.
		await expect(page.locator('input[name="name"]')).toHaveValue('Test Product Collection');
	});

	test('Should edit a product collection', async ({ page }) => {
		page.goto('/wp-admin/admin.php?page=sc-product-collections');

		// Click on the create product collection link.
		await page.click('.page-title-action');

		// Fill the form.
		await page.fill('input[name="name"]', 'Test Product Collection');

		// Click on the create button.
		await page.click('button[type="submit"]');

		// Wait for the page to load.
		await page.waitForLoadState('networkidle');

		// Check if Edit Collection page is loaded.
		await expect(page.locator('.components-card-header', { hasText: 'Edit Collection' })).toBeVisible();

		// Check if the collection is created with name by going to the edit page.
		await expect(page.locator('input[name="name"]')).toHaveValue('Test Product Collection');

		// Fill the form.
		await page.fill('input[name="name"]', 'Test Product Collection Updated');

		// Click on the save button.
		await page.click('button[type="submit"]');

		// Check if the collection is created with name by going to the edit page.
		await expect(page.locator('input[name="name"]')).toHaveValue('Test Product Collection Updated');
	});

	test('Should delete a product collection', async ({ page }) => {
		page.goto('/wp-admin/admin.php?page=sc-product-collections');

		// Click on the create product collection link by class - page-title-action
		await page.click('.page-title-action');

		// Fill the form
		await page.fill('input[name="name"]', 'Test Product Collection');

		// Click on the create button
		await page.click('button[type="submit"]');

		// Click on the dropdown button.
		await page.locator('sc-dropdown').click();

		// Click on the delete button in sc-menu-item which contains Delete text.
		await page.locator('sc-menu-item:has-text("Delete")').click();

		// After modal appear, click on the delete button.
		await page.locator('sc-button:has-text("Delete")').click();

		// Wait for the redirection to product collection page.
		await page.waitForURL('/wp-admin/admin.php?page=sc-product-collections');

		// After deleted collection, it should redirect to the product collection page.
		await expect(page.locator('h1')).toHaveText('Collections');

		// In the table, tr>td there should be no collection - No items found.
		await expect(page.locator('tr>td')).toHaveText('No items found.');
	});
});
