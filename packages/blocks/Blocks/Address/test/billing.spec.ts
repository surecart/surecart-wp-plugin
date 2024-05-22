/**
 * Wordpress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe('Billing address block editor', () => {
	test('Should allow adding of the billing address block', async ({
		editor,
		page,
		admin,
	}) => {
		await admin.createNewPost();

		const serializedBlockHTML = `
			<!-- wp:surecart/form {"mode":"test","success_url":""} -->
				<!-- wp:surecart/address /-->
			<!-- /wp:surecart/form -->
		`;

		await editor.setContent(serializedBlockHTML);
		await expect(
			page.locator(
				'sc-switch:has-text("Billing address is different from shipping address.")'
			)
		).toBeVisible();
	});
});

test.describe('Billing address block frontend', () => {
	test('Should use shipping address if present by default', async ({
		page,
		requestUtils,
	}) => {
		const serializedBlockHTML = `
			<!-- wp:surecart/form {"mode":"test","success_url":""} -->
				<!-- wp:surecart/address {"required":false} /-->
				<!-- wp:surecart/payment /-->
			<!-- /wp:surecart/form -->
		`;

		const post = await requestUtils.rest({
			method: 'POST',
			path: '/wp/v2/pages',
			data: {
				content: serializedBlockHTML,
			},
		});
		await page.goto(post.link);

		await expect(
			page.locator(
				'sc-switch:has-text("Billing address is different from shipping address.")'
			)
		).toBeVisible();
	});

	test('Should allow toggling between shipping and billing address', async ({
		requestUtils,
		page,
	}) => {
		const serializedBlockHTML = `
		<!-- wp:surecart/checkout-form {\"title\":\"Test Form\"} /-->
			<!-- wp:surecart/form {"mode":"test","success_url":""} -->
			    <!-- wp:surecart/address {"required":false} /-->
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

		await page
			.locator(
				'sc-switch:has-text("Billing address is different from shipping address.")'
			)
			.click();
		await page.waitForLoadState('networkidle');

		await expect(
			page.locator('sc-address:has-text("Billing Address")')
		).toBeVisible();

		await page
			.locator(
				'sc-switch:has-text("Billing address is different from shipping address.")'
			)
			.click();
		await page.waitForLoadState('networkidle');

		await expect(
			page.locator('sc-address:has-text("Billing Address")')
		).not.toBeVisible();
	});

	test('Should pass correct data to the server for the toggle', async ({
		page,
		requestUtils,
	}) => {
		const serializedBlockHTML = `
		<!-- wp:surecart/checkout-form {\"title\":\"Test Form\"} /-->
			<!-- wp:surecart/form {"mode":"test","success_url":""} -->
			    <!-- wp:surecart/address {"required":false} /-->
				<!-- wp:surecart/payment /-->
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

		// capture the request and expect to have billing_matches_shipping false in the body
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
			.locator(
				'sc-switch:has-text("Billing address is different from shipping address.")'
			)
			.click();

		// fill the shipping address to trigger API call
		await page.locator('sc-order-shipping-address >> sc-address').evaluate(
			(el: any) =>
				(el.address = {
					country: 'US',
					line_1: '123 Test St',
					city: 'Test City',
					postal_code: '12345',
					state: 'NY',
				})
		);

		const request = await requestPromise;

		const requestBody = JSON.parse(request.postData() || '{}');
		expect(requestBody.billing_matches_shipping).toBe(false);
	});

	test('Should collect billing address and send to server', async ({
		page,
		requestUtils,
	}) => {
		const testAddress = {
			country: 'US',
			line_1: '123 Test St',
			city: 'Test City',
			postal_code: '12345',
			state: 'NY',
		};
		const serializedBlockHTML = `
		<!-- wp:surecart/checkout-form {\"title\":\"Test Form\"} /-->
			<!-- wp:surecart/form {"mode":"test","success_url":""} -->
			   <!-- wp:surecart/payment /-->
				<!-- wp:surecart/address /-->
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

		// toggle the billing address
		await page
			.locator(
				'sc-switch:has-text("Billing address is different from shipping address.")'
			)
			.click();

		// fill the address
		await page
			.locator('sc-order-billing-address >> sc-address')
			.evaluate(
				(el: any, address) => (el.address = address),
				testAddress
			);

		await page.locator('body').click();

		const request = await requestPromise;
		const requestBody = JSON.parse(request.postData() || '{}');
		expect(requestBody.billing_address).toEqual(testAddress);
	});
});
