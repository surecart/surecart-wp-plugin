/**
 * Wordpress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies
 */
import { state as processorState } from '@store/processors';

test.describe('surecart/billing-address block editor', () => {
	test('Should allow adding of the billing address block', async ({
		editor,
		page,
		admin,
	}) => {
		await admin.createNewPost();

		const serializedBlockHTML = `
			<!-- wp:surecart/form {"mode":"test","success_url":""} -->
				<!-- wp:surecart/billing-address /-->
			<!-- /wp:surecart/form -->
		`;

		await editor.setContent(serializedBlockHTML);
		await expect(
			page.locator('div[data-type="surecart/billing-address"]')
		).toBeVisible();
	});

	test('Should allow modifying attributes', async ({
		editor,
		page,
		admin,
	}) => {
		await admin.createNewPost();
		const serializedBlockHTML = `
			<!-- wp:surecart/form {"mode":"test","success_url":""} -->
				<!-- wp:surecart/billing-address /-->
			<!-- /wp:surecart/form -->
		`;

		await editor.setContent(serializedBlockHTML);
		await page.locator('div[data-type="surecart/billing-address"]').click();

		// required attribute
		await page.locator('label:has-text("Required")').first().click();
		expect(await editor.getEditedPostContent()).toContain(
			'{"required":false}'
		);

		// labels attribute
		await page.getByLabel('SWITCH LABEL').fill('Test Label');
		await page.getByLabel('ADDRESS LABEL').fill('Test Address Label');
		expect(await editor.getEditedPostContent()).toContain('Test Label');
		expect(await editor.getEditedPostContent()).toContain(
			'Test Address Label'
		);
	});
});

test.describe('surecart/billing-address block frontend', () => {
	test.beforeAll(async ({ requestUtils }) => {});

	test('Should use shipping address if present by default', async ({
		page,
		requestUtils,
	}) => {
		const serializedBlockHTML = `
			<!-- wp:surecart/form {"mode":"test","success_url":""} -->
				<!-- wp:surecart/address {"required":false} /-->
				<!-- wp:surecart/payment /-->
				<!-- wp:surecart/billing-address /-->
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
				'sc-switch:has-text("Billing address same as shipping address.")'
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
				<!-- wp:surecart/billing-address /-->
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
				'sc-switch:has-text("Billing address same as shipping address.")'
			)
			.click();
		await page.waitForLoadState('networkidle');

		await expect(
			page.locator('sc-address:has-text("Billing Address")')
		).toBeVisible();

		await page
			.locator(
				'sc-switch:has-text("Billing address same as shipping address.")'
			)
			.click();
		await page.waitForLoadState('networkidle');

		await expect(
			page.locator('sc-address:has-text("Billing Address")')
		).not.toBeVisible();
	});

	test('Should collect billing address if shipping address is not present', async ({
		requestUtils,
		page,
	}) => {
		const serializedBlockHTML = `
			<!-- wp:surecart/form {"mode":"test","success_url":""} -->
				<!-- wp:surecart/payment /-->
				<!-- wp:surecart/billing-address /-->
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
			page.locator('sc-address:has-text("Billing Address")')
		).toBeVisible();
		await expect(
			page.locator(
				'sc-switch:has-text("Billing address same as shipping address.")'
			)
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
				<!-- wp:surecart/billing-address /-->
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
		// capture the request and expect to have billing_matches_shipping false in the body
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
				'sc-switch:has-text("Billing address same as shipping address.")'
			)
			.click();
		const request = await requestPromise;

		const requestBody = JSON.parse(request.postData() || '{}');
		expect(requestBody.billing_matches_shipping).toBe(false);
	});

	test('Should collect billing address and send to server', async ({
		page,
		requestUtils,
	}) => {
		const serializedBlockHTML = `
		<!-- wp:surecart/checkout-form {\"title\":\"Test Form\"} /-->
			<!-- wp:surecart/form {"mode":"test","success_url":""} -->
			   <!-- wp:surecart/payment /-->
				<!-- wp:surecart/billing-address /-->
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

		// fill the address
		await page
			.locator(
				'sc-order-billing-address >> sc-address >> sc-select[name="shipping_country"]'
			)
			.evaluate((el) => el.setAttribute('value', 'US'));
		await page
			.locator(
				'sc-order-billing-address >> sc-address >> sc-input[name="shipping_line_1"]'
			)
			.evaluate((el) => el.setAttribute('value', '123 Test St'));
		await page
			.locator(
				'sc-order-billing-address >> sc-address >> sc-input[name="shipping_city"]'
			)
			.evaluate((el) => el.setAttribute('value', 'Test City'));
		await page
			.locator(
				'sc-order-billing-address >> sc-address >> sc-input[name="shipping_postal_code"]'
			)
			.evaluate((el) => el.setAttribute('value', '12345'));

		// let requestCount = 0;
		// const requestPromise = page.waitForRequest((request) => {
		// 	if (
		// 		request.url().includes('checkouts') &&
		// 		request.method() === 'POST'
		// 	) {
		// 		requestCount++;
		// 	}

		// 	return requestCount === 2; // wait for the second request
		// });

		// await page
		// 	.locator(
		// 		'sc-order-billing-address >> sc-address >> sc-input[name="shipping_city"]'
		// 	)
		// 	.click();

		// const request = await requestPromise;
		// expect(request.postDataJSON()).toEqual({});
	});
});
