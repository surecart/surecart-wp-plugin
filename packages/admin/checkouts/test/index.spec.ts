import { test, expect } from '@playwright/test';

test.describe('Orders page', () => {
    test('Checkout ID should be created & updated in the URl when Add New is clicked in Orders.', async ({ page }) => {
        
        // navigate ot the order pages.
        await page.goto(
            '/wp-admin/admin.php?page=sc-orders'
        );

        // confirm that you can see the add new button.
        const addNewOrder = page.locator(
            'a[data-test-id="add-new-button"]'
        );

        await addNewOrder.click();
        
        await page.waitForURL('/wp-admin/admin.php?page=sc-checkouts&action=edit&id=\**');
       
        const urlParams = new URLSearchParams(page.url());

        expect(
            urlParams.has('id')
        ).toBe(true);
    });
});