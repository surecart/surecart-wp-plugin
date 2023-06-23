/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

const API_BASE_PATH = '/surecart/v1/products';
const API_PRODUCT_COLLECTION_BASE_PATH = '/surecart/v1/product_collections';

test.describe('Product Admin Page', () => {
    let productCollection = null;

    test.beforeAll(async ({ requestUtils }) => {
        // Create a product collection using REST API to use later.
        productCollection = await requestUtils.rest({
            method: 'POST',
            path: API_PRODUCT_COLLECTION_BASE_PATH,
            data: {
                name: 'Test Product Collection For Product Linking',
            },
        });
    });

    test.beforeEach(async ({ requestUtils }) => {
        const products = await requestUtils.rest({
            path: API_BASE_PATH,
            params: {
                per_page: 100,
            },
        });

        // Delete all one by one.
        await Promise.all(
            products.map((post) =>
                requestUtils.rest({
                    method: 'DELETE',
                    path: `${API_BASE_PATH}/${post.id}`,
                })
            )
        );
    });

    test.afterAll(async ({ requestUtils }) => {
        // Delete the product collection created in beforeAll.
        await requestUtils.rest({
            method: 'DELETE',
            path: `${API_PRODUCT_COLLECTION_BASE_PATH}/${productCollection?.id}`,
        })
    });

    test('Should create and update product', async ({ page }) => {
        // Go to create product page.
        page.goto('/wp-admin/admin.php?page=sc-products&action=edit');

        // Fill the form.
        await page.fill('input[name="name"]', 'Test Product');

        // Click on the create button.
        await page.click('button[type="submit"]');

        // Check if the product is created with name by going to the edit page.
        await expect(page.locator('input[name="name"]')).toHaveValue('Test Product');

        // Change the name.
        await page.fill('input[name="name"]', 'Test Product Updated');

        // Choose a product collection.
        await page.click('sc-form-control[label="Select Product Collections"] sc-select');

        // Click on the menu-item product collection - sc-menu-item with value of product collection id.
        await page.click(`sc-menu-item[value="${productCollection?.id}"]`);

        // Check if Test Product Collection For Product Linking is visible.
        await expect(page.locator('sc-form-control[label="Select Product Collections"] sc-tag')).toHaveText('Test Product Collection For Product Linking');
    });
});
