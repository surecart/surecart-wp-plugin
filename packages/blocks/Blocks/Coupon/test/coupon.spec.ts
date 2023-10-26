/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe('Coupon', () => {
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

		const coupons = await requestUtils.rest({
			path: '/surecart/v1/coupons',
			params: {
				per_page: 100,
			},
		});

		// Delete all one by one.
		// "surecart/v1/coupons" not yet supports batch requests.
		await Promise.all(
			coupons.map((post) =>
				requestUtils.rest({
					method: 'DELETE',
					path: `/surecart/v1/coupons/${post.id}`,
				})
			)
		);
	});

	test('Can add a valid coupon', async ({ page, requestUtils }) => {
		await requestUtils.rest({
			method: 'POST',
			path: '/surecart/v1/coupons',
			data: {
				name: 'Test',
				amount_off: 100,
				duration: 'once',
				promotions: [
					{
						code: 'Valid',
					},
				],
			},
		});

		product = await requestUtils.rest({
			method: 'POST',
			path: '/surecart/v1/products',
			data: {
				name: 'Test Product',
				status: 'published',
			},
		});

		const price = await requestUtils.rest({
			method: 'POST',
			path: '/surecart/v1/prices',
			data: {
				amount: 2000,
				product: product.id,
			},
		});

		// navigate to product page.
		await page.goto(`/checkout?line_items[0][price]=${price.id}`);
		await page.waitForLoadState('networkidle');

		await page.getByText('Add Coupon Code').click();
		await page.keyboard.type('Hello');

		await page
			.locator('sc-coupon-form sc-input')
			.getByText('Apply')
			.click();

		// Wait for the page to load.
		await page.waitForResponse((resp) =>
			resp.url().includes('surecart/v1/checkout')
		);

		const text = await page.getByText('coupon code is invalid');
		expect(text).toBeVisible();

		await page.locator('sc-coupon-form sc-input input').clear();
		await page.keyboard.type('Valid');

		await page
			.locator('sc-coupon-form sc-input')
			.getByText('Apply')
			.click();

		// Wait for the page to load.
		await page.waitForResponse((resp) =>
			resp.url().includes('surecart/v1/checkout')
		);

		const coupon = await page.locator('sc-coupon-form');
		expect(coupon).toContainText('VALID');
	});
});
