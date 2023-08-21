/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe('surecart/product-price-choices', () => {
	test.beforeEach(async ({ admin, editor }) => {
		await admin.visitSiteEditor({
			postId: 'surecart/surecart//product-info',
			postType: 'wp_template_part',
		});
		await editor.canvas.click('body');
	});

	test('Should render Logout button', async ({ editor, page }) => {
		await editor.setContent('');
		await editor.insertBlock({ name: 'surecart/product-price-choices' });

		// TODO: Add assertions.
	});
});
