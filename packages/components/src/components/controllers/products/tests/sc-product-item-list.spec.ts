/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

const API_BASE_PATH = '/surecart/v1/products';
const API_PRICE_PATH = '/surecart/v1/prices';
const API_PRODUCT_COLLECTION_BASE_PATH = '/surecart/v1/product_collections';

test.describe('Product List Page', () => {
  const products = [];
  let product1 = null;
  let product2 = null;

  // Insert some products
  // test.beforeAll(async ({ requestUtils }) => {
  //   product1 = createProduct(requestUtils, {
  //     name: 'Product 1',
  //     status: 'published',
  //     amount: 1000,
  //     image_url: 'https://placehold.co/600x400/EEE/31343C',
  //   });

  //   // Wait for 1 second, so that sorting will be different.
  //   setTimeout(() => {
  //     product2 = createProduct(requestUtils, {
  //       name: 'Product 2',
  //       status: 'published',
  //       amount: 2000,
  //       scratch_amount: 3000,
  //     });
  //   }, 1000);

  //   products.push(product1, product2);
  // });

  // Fetch the shop page ID.
  // ?p=
  // Pagename key wise option table fetch.

  test('Should render product list page', async ({ page }) => {
    await page.goto('/shop'); // window.scData.

    await expect(page.locator('h1')).toHaveText('Shop');
    await page.waitForLoadState('networkidle');

    // Check if Product 1 and Product 2 are showing in the list.
    const productTitles = await page.locator('sc-product-item-title');

    // Get the text content of each element
    const firstProductText = await productTitles.nth(0).innerText();
    const secondProductText = await productTitles.nth(1).innerText();

    // Check if Product 1 and Product 2 are showing in the list
    await expect(firstProductText).toBe('Product 2'); // It should be descending order - Latest first.
    await expect(secondProductText).toBe('Product 1');
  });

  test('Should search product', async ({ page }) => {
    await page.goto('/shop');

    await page.getByPlaceholder('Search').fill('Product 2');
    await page.click('.search-button');
    // await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000);

    // Check if Product 2 is showing in the list.
    const productTitlesAfterSearch = await page.locator('sc-product-item-title');
    const firstProductTextAfterSearch = await productTitlesAfterSearch.innerText();
    await expect(firstProductTextAfterSearch).toBe('Product 2');
  });

  test('Should clear search product', async ({ page }) => {
    await page.goto('/shop');

    await page.click('.tag--clearable'); // TODO: Should be accessible.
    await page.waitForLoadState('networkidle');
    await page.getByPlaceholder('Search').fill('Other');
    await page.click('.search-button');
    // await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
  });

  test('Sort Product by order', async ({ page }) => {
    await page.goto('/shop');

    // Test with Alphabetical ascending sorting.
    await page.click('.product-item-list__sort sc-dropdown');
    await page.click('text=Alphabetical, A-Z');
    await page.waitForLoadState('networkidle');

    // Check if Product 1 and Product 2 are showing in the list.
    const productTitles = await page.locator('sc-product-item-title');

    // Get the text content of each element
    const firstProductText = await productTitles.nth(0).innerText();
    const secondProductText = await productTitles.nth(1).innerText();

    // Check if Product 1 and Product 2 are showing in the list
    await expect(firstProductText).toBe('Product 1');
    await expect(secondProductText).toBe('Product 2');

    // Test with Alphabetical descending sorting.
    await page.click('.product-item-list__sort sc-dropdown');
    await page.click('text=Alphabetical, Z-A');
    await page.waitForLoadState('networkidle');
    // await page.waitForTimeout(3000);
    const productTitlesAfterAlphaDescendingSort = await page.locator('sc-product-item-title');
    const firstProductTextAfterAlphaDescendingSort = await productTitlesAfterAlphaDescendingSort.nth(0).innerText();
    const secondProductTextAfterAlphaDescendingSort = await productTitlesAfterAlphaDescendingSort.nth(1).innerText();
    await expect(firstProductTextAfterAlphaDescendingSort).toBe('Product 2');
    await expect(secondProductTextAfterAlphaDescendingSort).toBe('Product 1');
  });

  test('Should see product price', async ({ page }) => {
    await page.goto('/shop');

    // Check if Product 1 and Product 2 are showing in the list.
    const productPrices = await page.locator('sc-format-number');

    // Get the text content of each element
    const firstProductPrice = await productPrices.nth(0).innerText();
    const secondProductPrice = await productPrices.nth(1).innerText();

    await expect(firstProductPrice).toBe('$10');
    await expect(secondProductPrice).toBe('$20');
  });
});

export const createProduct = (requestUtils, data) => {
  const product = requestUtils.rest({
    method: 'POST',
    path: API_BASE_PATH,
    data: {
      name: data.name,
      status: data.status,
    },
  });

  // Create a product media.
  // if (data.image_url) {
  //   requestUtils.rest({
  //     method: 'POST',
  //     path: `surecart/v1/product_medias`,
  //     data: {
  //       product_id: product.id,
  //       url: data.image_url,
  //     },
  //   });
  // }

  // Create price.
  // requestUtils.rest({
  //     method: 'POST',
  //     path: API_PRICE_PATH,
  //     data: {
  //         product: product.id,
  //         name: data?.price_name || 'One Time',
  //         amount: data?.amount || 0,
  //         ...(data?.scratch_amount && { scratch_amount: data.scratch_amount }),
  //     },
  // });

  return product;
};
