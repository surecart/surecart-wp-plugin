/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe('Button', () => {
	test.beforeEach(async ({ admin }) => {
		await admin.createNewPost();
	});

	test('should render the button', async ({ editor, page }) => {
		await editor.insertBlock({
			name: 'surecart/button',
		});
		await page.keyboard.type('Content');
		const content = await editor.getEditedPostContent();
		expect(content).not.toBe(null);
	});
});
