/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe('surecart/checkbox', () => {
	test.beforeEach(async ({ admin }) => {
		await admin.createNewPost();
	});

	test('Should render Checkout button', async ({ editor }) => {
		await editor.insertBlock({
			name: 'surecart/checkbox',
		});

		const content = await editor.getEditedPostContent();
		expect(content).not.toBe(null);
	});
});
