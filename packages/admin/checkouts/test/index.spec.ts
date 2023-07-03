import { test, Page, expect } from '@playwright/test';

test('Checkout ID should be created & updated in the URl when Add New is clicked in Orders.', async ({ page }) => {
    
    // navigate ot the order pages.
    await page.goto(
        '/wp-admin/admin.php?page=sc-orders'
    );

    // confirm that you can see the add new button.
    const addNewOrder = page.locator(
        'button[data-test-id="add-new-button"]'
    );

    await addNewOrder.click();

   // Get the current page URL
    const url = await page.url();
    console.log('Current URL:', url);

    const pattern = /^https:\/\/surecartdev\.com\/wp-admin\/admin\.php\?page=sc-checkouts&action=edit&id=[a-f0-9-]+$/;

    // Assert the URL matches the pattern
    expect(url).toMatch(pattern);
});