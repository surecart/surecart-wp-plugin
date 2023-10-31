/**
 * Wordpress dependencies
 */
import { test } from '@wordpress/e2e-test-utils-playwright';

test.describe('surecart/price-variant-selector', () => {
	test.beforeEach(async ({ admin, editor,page,requestUtils }) => {
		let products = [
			{
				id: 'test-product-1',
				name: 'Test Product 1',
				variants: {
					data: [
						{
							id: '65d9ed92-5307-4b8e-a528-819a3ed8eb56',
							amount: 100,
							currency: 'USD',
							available_stock: 100,
							option_1: 'Red',
							option_2: 'M',
							option_3: 'Cotton',
						}
					]
				}
			}
		]

		await requestUtils.rest({
			method: 'GET',
			path: '/surecart/v1/products',
			data: products,
		})
	});

	test('Should render Price Variant Selector block', async ({ editor, page,admin }) => {
		await admin.createNewPost();

		const serializedBlockHTML = `
			<!-- wp:surecart/form {"mode":"test","success_url":"","prices":[{"quantity":1,"id":"65d9ed92-5307-4b8e-a528-819a3ed8eb56"}]} -->
				<!-- wp:surecart/price-variant-selector /-->
			<!-- /wp:surecart/form -->
		`;

		await editor.setContent(serializedBlockHTML);
		await editor.publishPost();
		await page.locator('sc-button:has-text("Select Product")').click();
		await page.locator('sc-select[placeholder="Choose product"]').click();
		await page.locator('sc-menu sc-menu-item:has-text("Test Product")').click();
	});
});
