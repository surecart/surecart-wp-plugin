/**
 * Wordpress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe('Totals', () => {
	test.beforeEach(async ({ admin, editor }) => {
		await admin.createNewPost();
	});

	test('Should render correctly', async ({ editor, page }) => {
		await editor.insertBlock({
			name: 'surecart/totals',
		});
		await page.keyboard.type('Content');
		const content = await editor.getEditedPostContent();
		expect(content).not.toBe(null);
	});

	test('Should render when collapsible, collapsed and not collapsed on mobile', async ({
		page,
		editor,
	}) => {
		await editor.insertBlock({
			name: 'surecart/totals',
			attributes: {
				collapsible: true,
				collapsed: false,
				collapsedMobile: false,
				closedText: 'Closed Text',
			},
		});

		const totalsBlock = page.locator(
			'role=document[name="Block: Totals"i]'
		);
		expect(totalsBlock).not.toBe(null);

		const summary = totalsBlock.locator('sc-order-summary');
		expect(summary).toHaveAttribute('collapsed', 'false');
	});
});
