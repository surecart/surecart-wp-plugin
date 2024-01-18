/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe('surecart/logout-button', () => {
	test.beforeEach(async ({ admin }) => {
		await admin.createNewPost();
	});

	test('Should render Logout button', async ({ editor, page }) => {
		await editor.insertBlock({ name: 'surecart/logout-button' });

		const content = await editor.getEditedPostContent();
		expect(content).toBe(`<!-- wp:surecart/logout-button /-->`);
	});

	test('Should toggle icon on click Show icon', async ({ editor, page }) => {
		await editor.insertBlock({ name: 'surecart/logout-button' });

		// Check first if sc-icon is visible or not.
		const logoutButtonBlock = page.locator(
			'role=document[name="Block: Logout Button"i]'
		);
		const logoutIcon = logoutButtonBlock.locator('sc-icon');
		await expect(logoutIcon).toBeVisible();

		const showIconLabelSelector = 'label:has-text("Show icon")';

		// Hide the icon.
		await page.click(showIconLabelSelector);
		const contentIconHidden = await editor.getEditedPostContent();
		expect(contentIconHidden).toBe(
			`<!-- wp:surecart/logout-button {"show_icon":false} /-->`
		);

		// Toggle click again and made the block in its default state.
		await page.click(showIconLabelSelector);
		const contentIconVisible = await editor.getEditedPostContent();
		expect(contentIconVisible).toBe(`<!-- wp:surecart/logout-button /-->`);
	});

	test('Should toggle on click redirect to current URL', async ({
		editor,
		page,
	}) => {
		await editor.insertBlock({ name: 'surecart/logout-button' });

		const redirectToCurrentLabelSelector =
			'label:has-text("Redirect to current URL")';

		// Disable redirecToCurrent
		await page.click(redirectToCurrentLabelSelector);
		const contentRedirectToCurrentFalse =
			await editor.getEditedPostContent();
		expect(contentRedirectToCurrentFalse).toBe(
			`<!-- wp:surecart/logout-button {"redirectToCurrent":false} /-->`
		);

		// Enable redirecToCurrent
		await page.click(redirectToCurrentLabelSelector);
		const contentRedirectToCurrentTrue =
			await editor.getEditedPostContent();
		expect(contentRedirectToCurrentTrue).toBe(
			`<!-- wp:surecart/logout-button /-->`
		);
	});
});
