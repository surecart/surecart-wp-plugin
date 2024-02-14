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

  let collection1 = null;
  let collection2 = null;
  let collections = [];

  test.beforeAll(async ({ requestUtils }) => {
    // Insert some product collections.
    // collection1 = createProductCollection(requestUtils, 'Collection 1');
    // collection2 = createProductCollection(requestUtils, 'Collection 2');
    // collections = [collection1, collection2];

    // Insert some products.
    // product1 = createProduct(requestUtils, {
    //   name: 'Product 1',
    //   status: 'published',
    //   amount: 1000,
    //   image_url: 'https://placehold.co/600x400/EEE/31343C',
    //   product_collection_ids: [collection1.id],
    // });

    // Wait for 1 second, so that sorting will be different.
    // setTimeout(() => {
    //   product2 = createProduct(requestUtils, {
    //     name: 'Product 2',
    //     status: 'published',
    //     amount: 2000,
    //     scratch_amount: 3000,
    //     product_collection_ids: [collection2.id],
    //   });
    // }, 1000);

    //   products.push(product1, product2);
  });

  // Fetch the shop page ID.
  // ?p=
  // Pagename key wise option table fetch.

  test('Should render product list page', async ({ page }) => {
    await page.goto('/shop');

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

  test('Should see product image', async ({ page }) => {
    await page.goto('/shop');

    // Check if Product 1 and Product 2 are showing in the list.
    const productImages = await page.locator('sc-product-item-image .product-img img');

    // Get the text content of each element
    const firstProductImage = await productImages.nth(0).getAttribute('src');
    await expect(firstProductImage).toBe('https://placehold.co/600x400/EEE/31343C');
  });

  test('Should filter by product collection', async ({ page }) => {
    await page.goto('/shop');

    const collectionFilters = await page.locator('.product-item-list__sort sc-dropdown');

    // Get the text content of each element
    await collectionFilters.nth(1).click();

    // Click on Collection 1.
    await page.click('text=Collection 1');
    await page.waitForLoadState('networkidle');

    // Check if Product 1 is showing in the list.
    const productTitles = await page.locator('sc-product-item-title');
    const firstProductText = await productTitles.innerText();
    await expect(firstProductText).toBe('Product 1');

    // Clear Collection filter.
    await page.locator('sc-tag').getByText('Collection 1', { exact: true }).click();
    await page.waitForLoadState('networkidle');
    const productTitlesAfterClearFilter = await page.locator('sc-product-item-title');
    const firstProductTextAfterClearFilter = await productTitlesAfterClearFilter.innerText();
    await expect(firstProductTextAfterClearFilter).toBe('Product 1');
  });
});

export const createProductCollection = (requestUtils, collectionName) => {
  return requestUtils.rest({
    method: 'POST',
    path: API_PRODUCT_COLLECTION_BASE_PATH,
    data: {
      name: collectionName,
    },
  });
};

export const createProduct = (requestUtils, data) => {
  const product = requestUtils.rest({
    method: 'POST',
    path: API_BASE_PATH,
    data: {
      name: data.name,
      status: data.status,
      product_collection_ids: data?.product_collection_ids || [],
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
