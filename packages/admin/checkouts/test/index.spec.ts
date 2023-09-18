import { test, expect } from '@playwright/test';

test.describe('Admin checkouts page', () => {
	test('Checkout id is created when the page is visited..', async ({
		page,
	}) => {
		await page.goto('/wp-admin/admin.php?page=sc-checkouts');
		// Wait for the page to load.
		await page.waitForLoadState('networkidle');
		const urlParams = new URLSearchParams(page.url());
		expect(urlParams.has('id')).toBe(true);
	});
});
