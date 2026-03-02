/**
 * External dependencies.
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies.
 */
import { create as createAccount } from '../provisional-account';
import {
	PRICE_API_PATH,
	PRODUCT_API_PATH
} from '../request-utils/endpoints';

test.describe('Product Page With Variant', () => {
	let product = null;

	test.beforeEach(async ({ requestUtils }) => {
		await createAccount(requestUtils);
		product = await createVariantProduct(requestUtils);
	});

	test('Loads variant and price selector', async ({ page }) => {
		await page.goto(product?.permalink);
		// Wait for the page to load.
		await page.waitForLoadState('networkidle');

		// The accessible name format is "Select {Label} {Value}" (no colon).
		await expect(page.getByRole('radio', { name: /Select Size\s+Small/i })).toHaveAttribute('aria-checked', 'true');
		await expect(page.getByRole('radio', { name: /Select Color\s+Black/i })).toHaveAttribute('aria-disabled', 'true');
		await expect(page.getByText('Sold Out').first()).toBeVisible();

		await page.getByRole('radio', { name: /Select Size\s+Large/i }).click();
		await expect(page.getByRole('radio', { name: /Select Color\s+Red/i })).toHaveAttribute('aria-disabled', 'true');
		await expect(page.getByRole('radio', { name: /Select Color\s+Black/i })).toHaveAttribute('aria-disabled', 'true');

		await page.getByRole('radio', { name: /Select Color\s+Blue/i }).click({ force: true });
		await expect(page.getByText('Unavailable').first()).toBeVisible();

		await page.getByRole('radio', { name: /Select Size\s+Small/i }).click();
		await page.getByRole('radio', { name: /Select Color\s+Red/i }).click();
		await page.getByText('One Time').click();
		await page.getByRole('button', { name: 'Add To Cart' }).click();

		// expect the cart to have the product.
		const cartDrawer = page.getByRole('dialog');
		await expect(cartDrawer).toContainText('Test Product');
		await expect(cartDrawer).toContainText('Small / Red');
		await expect(cartDrawer).toContainText('One Time');
		await expect(cartDrawer).toContainText('$20');
	});
});

export const createVariantProduct = async (requestUtils) => {
	const product = await requestUtils.rest({
		method: 'POST',
		path: PRODUCT_API_PATH,
		data: {
			name: 'Test Product',
			status: 'published',
			stock_enabled: true,
			variant_options: [
				{ name: 'Size', position: 0 },
				{ name: 'Color', position: 1 },
			],
			variants: [
				{
					option_1: 'Small',
					option_2: 'Black',
					position: 1,
					stock_adjustment: 0,
				},
				{
					option_1: 'Small',
					option_2: 'Red',
					position: 2,
					stock_adjustment: 1,
				},
				{
					option_1: 'Small',
					option_2: 'White',
					position: 3,
					stock_adjustment: 1,
				},
				{
					option_1: 'Small',
					option_2: 'Blue',
					position: 4,
					stock_adjustment: 1,
				},
				{
					option_1: 'Large',
					option_2: 'Black',
					position: 5,
				},
				{
					option_1: 'Large',
					option_2: 'Red',
					position: 6,
				},
				{
					option_1: 'Large',
					option_2: 'White',
					position: 7,
					stock_adjustment: 1,
				},
			],
		},
	});

	const prices = [
		{
			position: 0,
			name: 'One Time',
			amount: 2000,
			product: product.id,
		},
		{
			position: 1,
			name: 'Monthly',
			amount: 2000,
			scratch_amount: 3000,
			recurring_interval: 'month',
			recurring_interval_count: 1,
			product: product.id,
		},
	];

	await Promise.all(
		prices.map((price) =>
			requestUtils.rest({
				method: 'POST',
				path: PRICE_API_PATH,
				data: price,
			})
		)
	).catch((e) => {
		console.error(e);
	});

	return product;
};
