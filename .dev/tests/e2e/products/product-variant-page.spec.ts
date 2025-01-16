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

		expect(
			await page.getByRole('radio', {
				name: 'Select Size Small',
			})
		).toHaveAttribute('aria-checked', 'true');

		expect(
			await page.getByRole('radio', { name: 'Select Color Black' })
		).toHaveAttribute('aria-disabled', 'true');

		expect(await page.getByText('Add To Cart').first()).toBeVisible();

		await page
			.getByRole('radio', { name: 'Select Size Large' })
			.click({ force: true });

		expect(
			await page.getByRole('radio', { name: 'Select Color Red' })
		).toHaveAttribute('aria-disabled', 'true');
		expect(
			await page.getByRole('radio', { name: 'Select Color Red' })
		).toHaveAttribute('aria-checked', 'true');
		expect(
			await page.getByRole('radio', { name: 'Select Color Black' })
		).toHaveAttribute('aria-disabled', 'true');

		// expect(await page.getByRole('button', { name: 'Sold Out' }).first()).toBeVisible();

		await page
			.getByRole('radio', { name: 'Select Color Blue' })
			.click({ force: true });

		expect(await page.getByText('Unavailable').first()).toBeVisible();

		await page
			.getByRole('radio', { name: 'Select Size Small' })
			.click({ force: true });
		await page
			.getByRole('radio', { name: 'Select Color Red' })
			.click({ force: true });

		await page
			.getByText('One Time')
			.click({ force: true });

		await page.getByRole('button', { name: 'Add To Cart' }).click();

		// expect the cart to have the product.
		await expect(page.locator('dialog')).toContainText('Test Product');
		await expect(page.locator('dialog')).toContainText('Small / Red');
		await expect(page.locator('dialog')).toContainText('One Time');
		await expect(page.locator('dialog')).toContainText('$20');
	});
});

export const createVariantProduct = async (requestUtils) => {
	const product = await requestUtils.rest({
		method: 'POST',
		path: PRODUCT_API_PATH,
		data: {
			name: 'Test Product',
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
					stock_adjustment: 1,
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
