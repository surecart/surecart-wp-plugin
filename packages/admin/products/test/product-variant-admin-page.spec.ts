/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

const API_BASE_PATH = '/surecart/v1/products';
const PRICE_API_PATH = '/surecart/v1/prices';

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
			products.map((product) =>
				requestUtils.rest({
					method: 'DELETE',
					path: `${API_BASE_PATH}/${product.id}`,
				})
			)
		);
	});

	test('Should create a variant product', async ({ page, requestUtils }) => {
		// Create product with variant option and go to edit page.
		const product = await createVariantProduct(requestUtils);

		// Check if the variants attribute is there with 6 variants.
		await expect(product.variant_options).toHaveLength(2);
		await expect(product.variants).toHaveLength(6);

		// Go to Product edit page wp-admin/admin.php?page=sc-products&action=edit&id=e726c121-026b-4e9f-825d-d85d6d9e89af
		await page.goto(
			'/wp-admin/admin.php?page=sc-products&action=edit&id=' + product.id
		);

		// Check if the product is created with name by going to the edit page.
		await expect(page.locator('input[name="name"]')).toHaveValue(
			'Test Product'
		);
	});

	test('Should edit variant option', async ({ page, requestUtils }) => {
		// Create a variant product.
		const product = await createVariantProduct(requestUtils);

		// Update the variant product using API which has 8 variants.
		const updatedProduct = await updateVariantProduct(
			requestUtils,
			product.id
		);

		// Check if the variants attribute is there with updated 8 variants.
		await expect(updatedProduct.variants).toHaveLength(8);

		// Go to Product edit page wp-admin/admin.php?page=sc-products&action=edit&id=e726c121-026b-4e9f-825d-d85d6d9e89af
		await page.goto(
			'/wp-admin/admin.php?page=sc-products&action=edit&id=' + product.id
		);

		// Check if the product is updated with name.
		await expect(page.locator('input[name="name"]')).toHaveValue(
			'Test Product Updated'
		);

		// Edit the first variant option by clicking on the edit button #sc_option_0 's sc-button
		await page.click('#sc_option_0 sc-button');

		// Update Option name of Size with Size updated.
		await page.fill('input[name="sc_option_name_0"]', 'Size updated');

		// Change the option value of "Small" to "S" and "Large" to "L" and new option value "XL".
		await page.locator('#option_value_0_0 input').fill('S');
		await page.locator('#option_value_0_1 input').fill('L');
		await page.locator('#option_value_0_2 input').fill('XL');

		// Submit the form.
		await page.getByRole('button', { name: 'Save Product' }).click();

		// Wait for the page to load.
		await page.waitForLoadState('networkidle');

		/**
		 * Check if all updates are saved properly.
		 */
		// Check if the product is updated with name.
		await expect(page.locator('input[name="name"]')).toHaveValue(
			'Test Product Updated'
		);

		// Check if the variant option name is updated.
		await page.click('#sc_option_0 sc-button');
		await expect(
			page.locator('input[name="sc_option_name_0"]')
		).toHaveValue('Size updated');

		// Check if the variant option value is updated with S, L and XL.
		await expect(page.locator('#option_value_0_0 input')).toHaveValue('S');
		await expect(page.locator('#option_value_0_1 input')).toHaveValue('L');
		await expect(page.locator('#option_value_0_2 input')).toHaveValue('XL');
	});

	test('Should delete a variant option', async ({ page, requestUtils }) => {
		// Create a variant product.
		const product = await createVariantProduct(requestUtils);

		// Go to Product edit page wp-admin/admin.php?page=sc-products&action=edit&id=e726c121-026b-4e9f-825d-d85d6d9e89af
		await page.goto(
			'/wp-admin/admin.php?page=sc-products&action=edit&id=' + product.id
		);

		// To open the variant delete option.
		await page.click('#sc_option_0 sc-button');

		// Delete the variant option.
		await page.locator('#sc_option_0 sc-flex sc-button').click();

		// Submit the form.
		await page.getByRole('button', { name: 'Save Product' }).click();

		// Wait for the page to load.
		await page.waitForLoadState('networkidle');

		// Click on the edit button of the variant option.
		await page.click('#sc_option_0 sc-button');

		// Check if the variant option is now Color, cause we deleted the Size variant option.
		await expect(
			page.locator('input[name="sc_option_name_0"]')
		).toHaveValue('Color');
	});

	test('Should edit a variant product', async ({ page, requestUtils }) => {
		// Create a variant product.
		const product = await createVariantProduct(requestUtils);

		// Go to Product edit page wp-admin/admin.php?page=sc-products&action=edit&id=e726c121-026b-4e9f-825d-d85d6d9e89af
		await page.goto(
			'/wp-admin/admin.php?page=sc-products&action=edit&id=' + product.id
		);

		// Update Variant with some prices and sku.
		await page.fill('#sc_variant_amount_0 input', '10');
		await page.fill('#sc_variant_amount_1 input', '20');
		await page.fill('#sc_variant_amount_2 input', '30');

		await page.fill('#sc_variant_sku_0 input', 'Value-1');
		await page.fill('#sc_variant_sku_1 input', 'Value-2');
		await page.fill('#sc_variant_sku_2 input', 'Value-3');

		// Submit the form.
		await page.getByRole('button', { name: 'Save Product' }).click();

		// Wait for the page to load.
		await page.waitForLoadState('networkidle');

		/** Check if all updates are saved properly. */
		// Check if variant prices are updated.
		await expect(page.locator('#sc_variant_amount_0 input')).toHaveValue(
			'10'
		);
		await expect(page.locator('#sc_variant_amount_1 input')).toHaveValue(
			'20'
		);
		await expect(page.locator('#sc_variant_amount_2 input')).toHaveValue(
			'30'
		);

		// Check if the variant sku is updated.
		await expect(page.locator('#sc_variant_sku_0 input')).toHaveValue(
			'Value-1'
		);
		await expect(page.locator('#sc_variant_sku_1 input')).toHaveValue(
			'Value-2'
		);
		await expect(page.locator('#sc_variant_sku_2 input')).toHaveValue(
			'Value-3'
		);
	});
});

export const createVariantProduct = async (requestUtils) => {
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

	// Add a price.
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

export const updateVariantProduct = async (requestUtils, id) => {
	return await requestUtils.rest({
		method: 'PATCH',
		path: `${API_BASE_PATH}/${id}`,
		data: {
			name: 'Test Product Updated',
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
