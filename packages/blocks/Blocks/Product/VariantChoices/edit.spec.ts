/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe('surecart/product-variant-choices', () => {
	test.beforeAll(async ({ requestUtils }) => {
		await requestUtils.deleteAllTemplates('wp_template');
		await requestUtils.deleteAllTemplates('wp_template_part');
	});

	test.beforeEach(async ({ admin, editor }) => {
		await admin.visitSiteEditor({
			postId: 'surecart/surecart//single-product',
			postType: 'wp_template',
			canvas: 'edit',
		});
	});

	test('Should have variant choices block', async ({ editor, page }) => {
		await expect(
			page
				.frameLocator('iframe[name="editor-canvas"]')
				.locator('[data-type="surecart/product-variant-choices"]')
		).toBeVisible();
	});
});
