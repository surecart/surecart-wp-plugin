/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';
import { create as createAccount } from '../provisional-account';

test.describe('Coupon', () => {
	let product;

	test.beforeEach(async ({ requestUtils }) => {
		await createAccount(requestUtils);
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

		await page.getByText('Add Coupon Code').locator('visible=true').click();
		await page
			.getByPlaceholder('Enter coupon code')
			.locator('input')
			.fill('Hello');

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

		await page.waitForLoadState('networkidle');

		const coupon = await page.getByText('VALID');
		expect(coupon).toBeDefined();
	});
});
