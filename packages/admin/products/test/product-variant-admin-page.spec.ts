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

	test('Should create a new variant product using API', async ({
		page,
		requestUtils,
	}) => {
		// Create product with variant option and go to edit page.
		const product = await requestUtils.rest({
			method: 'POST',
			path: API_BASE_PATH,
			data: {
				name: 'Test Product',
				variant_options: [
					{ name: 'Size', position: 0 },
					{ name: 'Color', position: 1 },
				],
				variants: [
					{ option_1: 'S', option_2: 'Black', position: 1 },
					{ option_1: 'S', option_2: 'Red', position: 2 },
					{ option_1: 'S', option_2: 'White', position: 3 },
					{ option_1: 'L', option_2: 'Black', position: 4 },
					{ option_1: 'L', option_2: 'Red', position: 5 },
					{ option_1: 'L', option_2: 'White', position: 6 },
				],
			},
		});

		// Go to Product edit page wp-admin/admin.php?page=sc-products&action=edit&id=e726c121-026b-4e9f-825d-d85d6d9e89af
		await page.goto(
			'/wp-admin/admin.php?page=sc-products&action=edit&id=' + product.id
		);

		// Check if the product is created with name by going to the edit page.
		await expect(page.locator('input[name="name"]')).toHaveValue(
			'Test Product'
		);

		// Check if the Variants text is present in components-card__header.
		await expect(page.locator('.components-card__header')).toContainText(
			'Variants'
		);
	});
});
