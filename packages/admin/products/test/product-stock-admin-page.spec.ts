/**
 * WordPress dependencies.
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies.
 */
import { createProduct } from '../../tests/request-utils/products';

test.describe('Product Admin Page For Stock', () => {
	test('Should create a product with stock', async ({
		page,
		requestUtils,
	}) => {
		const product = await createProduct(requestUtils, {
			name: 'Test Product',
			stock_enabled: true,
			stock_adjustment: 10,
		});

		// Go to Product edit page
		await page.goto(
			`/wp-admin/admin.php?page=sc-products&action=edit&id=${product?.id}`
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

		// Wait for the page to load.
		await page.waitForLoadState('networkidle');

		const stockControl = await page
			.locator('sc-form-control')
			.filter({ hasText: 'Available Stock' });

		expect(await stockControl.locator('input')).toHaveValue('5');

		await stockControl.locator('.button__decrease').click();
		expect(await stockControl.locator('input')).toHaveValue('4');
		await stockControl.locator('.button__increase').click();
		await stockControl.locator('.button__increase').click();
		expect(await stockControl.locator('input')).toHaveValue('6');

		await page.locator('#sc-adjust-stock').click();

		const adjustBy = await page
			.locator('.components-modal__content sc-form-control')
			.filter({ hasText: 'Adjust By' });
		expect(await adjustBy.locator('input')).toHaveValue('1');

		const available = await page
			.locator('.components-modal__content sc-form-control')
			.filter({ hasText: 'Available' });
		expect(await available.locator('input')).toHaveValue('6');

		const onHand = await page
			.locator('.components-modal__content sc-form-control')
			.filter({ hasText: 'On Hand' });
		expect(await onHand.locator('input')).toHaveValue('6');

		await adjustBy.locator('.button__increase').click();
		expect(await adjustBy.locator('input')).toHaveValue('2');
		expect(await available.locator('input')).toHaveValue('7');
		expect(await onHand.locator('input')).toHaveValue('7');

		await page.locator('sc-button', { hasText: 'Adjust' }).click();
		expect(await stockControl.locator('input')).toHaveValue('7');

		await page.getByRole('button', { name: 'Save Product' }).click();

		// Wait for the page to load.
		await page.waitForResponse((resp) =>
			resp.url().includes('surecart/v1/product')
		);

		expect(await stockControl.locator('input')).toHaveValue('7');
	});
});
