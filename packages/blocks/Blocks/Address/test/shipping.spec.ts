import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe('Shipping address block editor', () => {
	test.beforeEach(async ({ admin, editor }) => {
		await admin.createNewPost();

		const serializedBlockHTML = `
			<!-- wp:surecart/form {"mode":"test","success_url":""} -->
				<!-- wp:surecart/address /-->
			<!-- /wp:surecart/form -->
		`;

		await editor.setContent(serializedBlockHTML);
	});

	test('Should allow adding of the shipping address block', async ({
		page,
	}) => {
		await expect(
			page.locator('sc-address[label="Shipping Address"]')
		).toBeVisible();
	});

	test('Should allow switching between compact and full shipping address', async ({
		page,
	}) => {
		await page.locator('sc-address[label="Shipping Address"]').click();

		// locate the compact address toggle and click to toggle
		await page
			.locator('label:has-text("Use a compact address if possible")')
			.nth(0)
			.click();

		// compact address should be visible
		await expect(
			page.locator('sc-compact-address[label="Shipping Address"]')
		).toBeVisible();
	});
});

test.describe('Shipping address block frontend', () => {
	test.beforeEach(async ({ requestUtils, page }) => {
		const serializedBlockHTML = `
		<!-- wp:surecart/checkout-form {\"title\":\"Test Form\"} /-->
			<!-- wp:surecart/form {"mode":"test","success_url":""} -->
				<!-- wp:surecart/address {"label": "Test Shipping Address"} /-->
			<!-- /wp:surecart/form -->
		<!-- /wp:surecart/checkout-form -->
		`;

		const post = await requestUtils.rest({
			method: 'POST',
			path: '/wp/v2/pages',
			data: {
				content: serializedBlockHTML,
			},
		});

		await page.goto(post.link);
	});

	test('Should show the shipping address with the correct attributes', async ({
		page,
	}) => {
		await expect(
			page.locator(
				'sc-order-shipping-address[label="Test Shipping Address"]'
			)
		).toBeVisible();
	});

	test('Should collect the shipping address data', async ({ page }) => {
		const testAddress = {
			firstName: 'John',
			lastName: 'Doe',
			address: '123 Main St',
			city: 'New York',
			state: 'NY',
			zip: '10001',
			country: 'US',
		};

		// capture the request and expect to have the shipping address in the body
		let requestCount = 0;
		const requestPromise = page.waitForRequest((request) => {
			if (
				request.url().includes('checkouts') &&
				request.method() === 'POST'
			) {
				requestCount++;
			}

			return requestCount === 2; // wait for the second request
		});

		await page
			.locator('sc-order-shipping-address >> sc-address')
			.evaluate((el: any, address) => {
				el.address = address;
			}, testAddress);

		await page.locator('body').click();
		const request = await requestPromise;

		const requestBody = JSON.parse(request.postData() || '{}');
		expect(requestBody.shipping_address).toEqual(testAddress);
	});
});
