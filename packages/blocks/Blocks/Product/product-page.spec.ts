/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe('Product Page', () => {
	let product;

	test.beforeEach(async ({ requestUtils }) => {
		const products = await requestUtils.rest({
			path: '/surecart/v1/products',
			params: {
				per_page: 100,
			},
		});
		// Delete all one by one.
		// "surecart/v1/products" not yet supports batch requests.
		await Promise.all(
			products.map((post) =>
				requestUtils.rest({
					method: 'DELETE',
					path: `/surecart/v1/products/${post.id}`,
				})
			)
		);
	});

	test('Should have a product page', async ({ page, requestUtils }) => {
		product = await requestUtils.rest({
			method: 'POST',
			path: '/surecart/v1/products',
			data: {
				name: 'Test Product',
				status: 'published',
			},
		});

		const prices = [
			{
				position: 1,
				name: 'Monthly',
				amount: 2000,
				scratch_amount: 3000,
				recurring_interval: 'month',
				recurring_interval_count: 1,
				product: product.id,
			},
			{
				position: 0,
				name: 'One Time',
				amount: 2000,
				product: product.id,
			},
		];

		await Promise.all(
			prices.map((price) =>
				requestUtils.rest({
					method: 'POST',
					path: '/surecart/v1/prices',
					data: price,
				})
			)
		);

		// navigate to product page.
		await page.goto(product.permalink);

		// expect the product page title.
		await expect(page.locator('.product-title')).toHaveText('Test Product');

		// expect the default price.
		await expect(page.locator('.product-price')).toContainText('$20');

		// changing price should change the product price.
		await page
			.locator('sc-choice-container', { hasText: 'Monthly' })
			.click();
		await expect(page.locator('.product-price')).toContainText('Sale');

		// add to cart.
		const button = await page.locator('.wp-block-button[add-to-cart]');
		await button.click();

		// expect the cart to have the product.
		await expect(page.locator('#sc-cart')).toContainText('Test Product');
	});
});
