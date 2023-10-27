/**
 * WordPress dependencies.
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

const API_BASE_PATH = '/surecart/v1/products';
const PRICE_API_PATH = '/surecart/v1/prices';

test.describe('Product Admin Page With Variant', () => {
	test.beforeEach(async ({ page }) => {
		// make sure variants are in view.
		await page.setViewportSize({
			width: 1728,
			height: 3000,
		});
	});

	test('Can load and modify variants', async ({ page, requestUtils }) => {
		const product = await createVariantProduct(requestUtils);

		// Go to Product edit page wp-admin/admin.php?page=sc-products&action=edit&id=e726c121-026b-4e9f-825d-d85d6d9e89af
		await page.goto(
			'/wp-admin/admin.php?page=sc-products&action=edit&id=' + product.id
		);

		// Wait for the page to load.
		await page.waitForLoadState('networkidle');

		// expect them to be loaded.
		expect(await page.locator('.variant-option').count()).toBe(2);
		expect(await page.locator('.variant-image').count()).toBe(8);

		await page.click('[aria-label="Edit Size"]');
		await page.click('[aria-label="Delete Size"]');

		// expect them to be loaded.
		expect(await page.locator('.variant-option').count()).toBe(1);
		expect(await page.locator('.variant-image').count()).toBe(4);

		// Submit the form.
		await page.getByRole('button', { name: 'Save Product' }).click();

		// Wait for the page to load.
		await page.waitForLoadState('networkidle');

		// expect them to be loaded.
		expect(await page.locator('.variant-option').count()).toBe(1);
		expect(await page.locator('.variant-image').count()).toBe(4);
	});

	test('Should edit variant option', async ({ page, requestUtils }) => {
		const product = await createVariantProduct(requestUtils);

		// Go to Product edit page wp-admin/admin.php?page=sc-products&action=edit&id=e726c121-026b-4e9f-825d-d85d6d9e89af
		await page.goto(
			'/wp-admin/admin.php?page=sc-products&action=edit&id=' + product.id
		);

		await page.click('sc-button[aria-label="Edit Size"]');
		await page
			.getByPlaceholder('Option Name')
			.first()
			.locator('input')
			.fill('Size Updated');

		// Change the option value of "Small" to "S" and "Large" to "L" and new option value "XL".
		await page
			.locator('sc-input', { hasText: 'Option Value 1' })
			.first()
			.locator('input')
			.fill('S');
		await page
			.locator('sc-input', { hasText: 'Option Value 2' })
			.first()
			.locator('input')
			.fill('L');
		await page
			.getByPlaceholder('Add another value')
			.first()
			.locator('input')
			.fill('XL');

		// Submit the form.
		await page.getByRole('button', { name: 'Save Product' }).click();

		// Wait for the page to load.
		await page.waitForLoadState('networkidle');

		await page.click('sc-button[aria-label="Edit Size Updated"]');

		expect(
			await page.getByPlaceholder('Option Name').first().locator('input')
		).toHaveValue('Size Updated');
		expect(
			await page
				.locator('sc-input', { hasText: 'Option Value 1' })
				.first()
				.locator('input')
		).toHaveValue('S');
		expect(
			await page
				.locator('sc-input', { hasText: 'Option Value 2' })
				.first()
				.locator('input')
		).toHaveValue('L');

		expect(
			await page
				.locator('sc-input', { hasText: 'Option Value 3' })
				.first()
				.locator('input')
		).toHaveValue('XL');
	});

	test('Should edit a variant', async ({ page, requestUtils }) => {
		// Create a variant product.
		const product = await createVariantProduct(requestUtils);

		// Go to Product edit page wp-admin/admin.php?page=sc-products&action=edit&id=e726c121-026b-4e9f-825d-d85d6d9e89af
		await page.goto(
			'/wp-admin/admin.php?page=sc-products&action=edit&id=' + product.id
		);

		// Wait for the page to load.
		await page.waitForLoadState('networkidle');

		// Update Variant with some prices and sku.
		await page
			.locator('.variant-price')
			.locator('nth=0')
			.locator('input')
			.fill('10');
		await page
			.locator('.variant-price')
			.locator('nth=1')
			.locator('input')
			.fill('20');
		await page
			.locator('.variant-price')
			.locator('nth=2')
			.locator('input')
			.fill('30');

		await page
			.locator('.variant-sku')
			.locator('nth=0')
			.locator('input')
			.fill('Value-1');
		await page
			.locator('.variant-sku')
			.locator('nth=1')
			.locator('input')
			.fill('Value-2');
		await page
			.locator('.variant-sku')
			.locator('nth=2')
			.locator('input')
			.fill('Value-3');

		// Submit the form.
		await page.getByRole('button', { name: 'Save Product' }).click();

		// Wait for the page to load.
		await page.waitForLoadState('networkidle');

		expect(
			await page
				.locator('.variant-price')
				.locator('nth=0')
				.locator('input')
		).toHaveValue('10');
		expect(
			await page
				.locator('.variant-price')
				.locator('nth=1')
				.locator('input')
		).toHaveValue('20');
		expect(
			await page
				.locator('.variant-price')
				.locator('nth=2')
				.locator('input')
		).toHaveValue('30');

		expect(
			await page.locator('.variant-sku').locator('nth=0').locator('input')
		).toHaveValue('Value-1');
		expect(
			await page.locator('.variant-sku').locator('nth=1').locator('input')
		).toHaveValue('Value-2');
		expect(
			await page.locator('.variant-sku').locator('nth=2').locator('input')
		).toHaveValue('Value-3');
	});
});

export const createVariantProduct = (requestUtils) => {
	return requestUtils.rest({
		method: 'POST',
		path: API_BASE_PATH,
		data: {
			name: 'Test Product',
			variant_options: [
				{ name: 'Size', position: 0 },
				{ name: 'Color', position: 1 },
			],
			variants: [
				{ option_1: 'Small', option_2: 'Black', position: 1 },
				{ option_1: 'Small', option_2: 'Red', position: 2 },
				{ option_1: 'Small', option_2: 'White', position: 3 },
				{ option_1: 'Small', option_2: 'Blue', position: 4 },
				{ option_1: 'Large', option_2: 'Black', position: 5 },
				{ option_1: 'Large', option_2: 'Red', position: 6 },
				{ option_1: 'Large', option_2: 'White', position: 7 },
				{ option_1: 'Large', option_2: 'Blue', position: 8 },
			],
		},
	});
};
