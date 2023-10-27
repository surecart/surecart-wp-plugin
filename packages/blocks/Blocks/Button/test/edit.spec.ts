/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe('Button', () => {
	test.beforeEach(async ({ admin }) => {
		await admin.createNewPost();
	});

	test('should render the button', async ({ editor, page }) => {
		// Inserting a quote block
		await editor.insertBlock({
			name: 'surecart/button',
		});
		await expect(
			page.locator('[data-type="surecart/button"]')
		).toBeVisible();
	});
});
