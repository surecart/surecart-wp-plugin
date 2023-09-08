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
		await expect(page.locator('h1')).toHaveText('Product Collections');

		// Check if the page has Add New button.
		await expect(page.locator('.page-title-action')).toHaveText('Add New');

		// Check if the page has product collection table.
		await expect(page.locator('.wp-list-table')).toBeVisible();
	});

	test('Should create a new product collection', async ({ page }) => {
		page.goto('/wp-admin/admin.php?page=sc-product-collections');

		// Click on the create product collection link by class - page-title-action
		await page.click('.page-title-action');

		// Fill the form
		await page.fill('input[name="name"]', 'Test Product Collection');

		// Click on the create button
		await page.click('button[type="submit"]');

		// Check if the collection is created with name and description by going to the edit page.
		await expect(page.locator('input[name="name"]')).toHaveValue(
			'Test Product Collection'
		);
	});

	test('Should edit a product collection', async ({ page, requestUtils }) => {
		// Create a product collection using REST API.
		const collection = await requestUtils.rest({
			method: 'POST',
			path: API_BASE_PATH,
			data: {
				name: 'Edit Product Collection',
			},
		});

		await page.goto(
			`/wp-admin/admin.php?page=sc-product-collections&action=edit&id=${collection.id}`
		);

		// Check if the collection is created with name by going to the edit page.
		await expect(page.locator('input[name="name"]')).toHaveValue(
			'Edit Product Collection'
		);

		// Fill the form.
		await page.fill(
			'input[name="name"]',
			'Edit Product Collection Updated'
		);

		// Click on the save button.
		await page.click('button[type="submit"]');

		// Wait for the page to load.
		await page.waitForLoadState('networkidle');

		// Check if the collection is created with name by going to the edit page.
		await expect(
			page.locator('.components-snackbar__content')
		).toBeVisible();

		// Check if the collection is created with name by going to the edit page.
		await expect(page.locator('input[name="name"]')).toHaveValue(
			'Edit Product Collection Updated'
		);
	});

	test('Should delete a product collection', async ({
		page,
		requestUtils,
	}) => {
		// Create a product collection using REST API.
		const collection = await requestUtils.rest({
			method: 'POST',
			path: API_BASE_PATH,
			data: {
				name: 'Delete Product Collection',
			},
		});

		await page.goto(
			`/wp-admin/admin.php?page=sc-product-collections&action=edit&id=${collection.id}`
		);

		// Click on the dropdown button.
		await page.getByRole('button', { name: 'more horizontal' }).click();

		// Click on the delete button in sc-menu-item which contains Delete text.
		await page.getByRole('menuitem', { name: 'Delete' }).click();

		// Confirm.
		await page.getByRole('button', { name: 'Delete' }).click();

		// back to the product collection list page.
		await expect(
			page.getByRole('heading', { name: 'Product Collections' })
		).toBeVisible();
	});
});
