/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

const API_BASE_PATH = '/surecart/v1/products';
const PRICE_API_PATH = '/surecart/v1/prices';

test.describe('Product Admin Page For Stock', () => {
	test.beforeEach(async ({ requestUtils }) => {
		const products = await requestUtils.rest({
			path: API_BASE_PATH,
			params: {
				per_page: 100,
			},
		});

		// Delete all one by one.
		await Promise.all(
			products.map((product) =>
				requestUtils.rest({
					method: 'DELETE',
					path: `${API_BASE_PATH}/${product.id}`,
				})
			)
		);
	});

	test('Should create a product with/without stock', async ({
		page,
		requestUtils,
	}) => {
		// Create product and check if stock is disabled by default.
		const productStockDisabled = await createProduct(requestUtils, {
			name: 'Test Product',
		});
		await expect(productStockDisabled.stock_enabled).toBe(false);

		const product = await createProduct(requestUtils, {
			name: 'Test Product',
			stock_enabled: true,
			stock_adjustment: 10,
		});
		await expect(product.stock_enabled).toBe(true);
		await expect(product.stock).toBe(10);
		await expect(product.available_stock).toBe(10);
		await expect(product.held_stock).toBe(0);

		// Go to Product edit page wp-admin/admin.php?page=sc-products&action=edit&id=e726c121-026b-4e9f-825d-d85d6d9e89af
		await page.goto(
			'/wp-admin/admin.php?page=sc-products&action=edit&id=' + product.id
		);

		// Check if stock is enabled in the UI.
		await expect(page.locator('input[name="stock_enabled"]')).toBeChecked();

		// Check if stock=10, by sc-quantity-select input value
		await expect(
			page.locator('sc-quantity-select input[type="number"]')
		).toHaveValue('10');
	});

	test('Should edit a product stock', async ({ page, requestUtils }) => {
		const product = await createProduct(requestUtils, {
			name: 'Test Product',
			stock_enabled: true,
			stock_adjustment: 5,
		});

		// Go to Product edit page wp-admin/admin.php?page=sc-products&action=edit&id=e726c121-026b-4e9f-825d-d85d6d9e89af
		await page.goto(
			'/wp-admin/admin.php?page=sc-products&action=edit&id=' + product.id
		);

		// Fill stock adjustment to 20
		await page
			.locator('sc-quantity-select input[type="number"]')
			.fill('20');

		// Open the stock adjustment modal
		await page.locator('#sc-adjust-stock').click();

		// Check with a negative stock adjustment by decrementing the stock.
		await page
			.locator('sc-form-control')
			.filter({ hasText: 'Adjust the stock quantity' })
			.locator('sc-quantity-select .button__decrease')
			.click();

		// Click on Adjust button.
		await page.locator('sc-button', { hasText: 'Adjust' }).click();

		// Let's see if the stock is updated to 15.
		await expect(
			page
				.locator('sc-flex')
				.filter({ hasText: 'Stock quantity' })
				.locator('input[type="number"]')
		).toHaveValue('19');

		// Check with a positive stock adjustment by incrementing the stock.
		await page.locator('#sc-adjust-stock').click();
		await page
			.locator('sc-form-control')
			.filter({ hasText: 'Adjust the stock quantity' })
			.locator('sc-quantity-select .button__increase')
			.click();
		await page.locator('sc-button', { hasText: 'Adjust' }).click();
		await expect(
			page
				.locator('sc-flex')
				.filter({ hasText: 'Stock quantity' })
				.locator('input[type="number"]')
		).toHaveValue('20');

		// Check with a direct stock adjustment value
		await page.locator('#sc-adjust-stock').click();
		await page
			.locator('sc-form-control')
			.filter({ hasText: 'Adjust the stock quantity' })
			.locator('.input__control--allow-negative')
			.fill('15');
		await page.click('body');
		await page.locator('sc-button', { hasText: 'Adjust' }).click();
		await expect(
			page
				.locator('sc-flex')
				.filter({ hasText: 'Stock quantity' })
				.locator('input[type="number"]')
		).toHaveValue('20'); // Because, initial stock was 5 and we added 15.

		// Click on outside to trigger the change event.
		await page.click('body');

		// Click on save button.
		await page.getByRole('button', { name: 'Save Product' }).click();

		// Wait for the page to load.
		await page.waitForLoadState('networkidle');

		// Check if stock is updated to 35.
		await expect(
			page
				.locator('sc-flex')
				.filter({ hasText: 'Stock quantity' })
				.locator('input[type="number"]')
		).toHaveValue('20');
	});
});

export const createProduct = async (requestUtils, data) => {
	const product = await requestUtils.rest({
		method: 'POST',
		path: API_BASE_PATH,
		data,
	});

	// Create a price for the product.
	await requestUtils.rest({
		method: 'POST',
		path: PRICE_API_PATH,
		data: {
			amount: '1000.00',
			currency: 'usd',
			product: product.id,
		},
	});

	return product;
};
