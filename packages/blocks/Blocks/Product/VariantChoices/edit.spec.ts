/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe('surecart/product-variant-choices', () => {
	test.beforeEach(async ({ admin, editor }) => {
		await admin.visitSiteEditor({
			postId: 'surecart/surecart//product-info',
			postType: 'wp_template_part',
		});
		await editor.canvas.click('body');
	});

	test('Should render Variant Choices Block', async ({ editor, page }) => {
		await editor.setContent('');
		await editor.insertBlock({ name: 'surecart/product-variant-choices' });

		const content = await editor.getEditedPostContent();
		expect(content).toBe(`<!-- wp:surecart/product-variant-choices /-->`);
	});
});
