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
			<!-- wp:surecart/form {"mode":"test","success_url":""} -->
			    <!-- wp:surecart/address {"required":false} /-->
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

		await page
			.locator(
				'sc-switch:has-text("Billing address same as shipping address.")'
			)
			.click();
		await page.waitForLoadState('networkidle');

		await expect(
			page.locator('sc-address:has-text("Billing Address")')
		).toBeVisible();
	});

	test('Should collect billing address if shipping address is not present', async ({
		requestUtils,
		page,
	}) => {
		const serializedBlockHTML = `
			<!-- wp:surecart/form {"mode":"test","success_url":""} -->
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
	});
});
