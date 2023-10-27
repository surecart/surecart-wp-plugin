/**
 * WordPress dependencies.
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe('Product Page With Variant', () => {
	test('Loads variant and price selector', async ({ page, requestUtils }) => {
		const product = await createVariantProduct(requestUtils);
		await page.goto(product?.permalink);
		// Wait for the page to load.
		await page.waitForLoadState('networkidle');

		expect(await page.locator('button').getByText('Small')).toHaveAttribute(
			'aria-checked',
			'true'
		);
		expect(await page.locator('button').getByText('Black')).toHaveAttribute(
			'aria-disabled',
			'true'
		);

		expect(await page.getByText('Add To Cart').first()).toBeVisible();

		await page.locator('button').getByText('Large').click({ force: true });

		expect(await page.locator('button').getByText('Red')).toHaveAttribute(
			'aria-disabled',
			'true'
		);
		expect(await page.locator('button').getByText('Red')).toHaveAttribute(
			'aria-checked',
			'true'
		);
		expect(await page.locator('button').getByText('Blue')).toHaveAttribute(
			'aria-disabled',
			'true'
		);

		expect(await page.getByText('Sold Out').first()).toBeVisible();

		await page.locator('button').getByText('Blue').click({ force: true });

		expect(await page.getByText('Unavailable').first()).toBeVisible();
	});
});

export const createVariantProduct = async (requestUtils) => {
	const product = await requestUtils.rest({
		method: 'POST',
		path: '/surecart/v1/products',
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

	return product;
};
