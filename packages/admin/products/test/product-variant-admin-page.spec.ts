/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

const API_BASE_PATH = '/surecart/v1/products';

test.describe('Product Admin Page With Variant', () => {
	test.beforeEach(async ({ requestUtils }) => {
		const products = await requestUtils.rest({
			path: API_BASE_PATH,
			params: {
				per_page: 100,
			},
		});

		// Delete all one by one.
		await Promise.all(
			products.map((post) =>
				requestUtils.rest({
					method: 'DELETE',
					path: `${API_BASE_PATH}/${post.id}`,
				})
			)
		);
	});

	test('Should create a new variant product', async ({ page }) => {
		// Go to product create page.
		page.goto('/wp-admin/admin.php?page=sc-products&action=edit');

		// Fill the form.
		await page.fill('input[name="name"]', 'Test Product');

		// Select Variant option by .sc-product-type-variant
		await page.click('.sc-product-type-variant');

		// Save the product.
		await page.click('button[type="submit"]');

		// Check if the product is being created after being redirected to the edit page.
		// Check there is content sc-model-form sc-breadcrumbs  Edit Product.
		await expect(page.locator('sc-model-form sc-breadcrumbs')).toHaveText(
			'Edit Product'
		);

		await expect(page.locator('input[name="name"]')).toHaveValue(
			'Test Product'
		);

		// Check if the product is created with New variant option button
		await expect(
			page.locator('sc-button:has-text("Add variant")')
		).toBeVisible();
	});

	test('Should Handle Add New New Variant', async ({ page }) => {
		// Create product with variant option and go to edit page.

		// Go to Product edit page wp-admin/admin.php?page=sc-products&action=edit&id=e726c121-026b-4e9f-825d-d85d6d9e89af

		// Check if the button is clickable.
	});
});
