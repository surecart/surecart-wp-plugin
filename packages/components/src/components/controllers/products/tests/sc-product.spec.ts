/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

const API_BASE_PATH = '/surecart/v1/products';
const API_MEDIA_PATH = '/surecart/v1/product_medias';
const API_PRICE_PATH = '/surecart/v1/prices';
const API_PRODUCT_COLLECTIO_PATH = '/surecart/v1/product_collections';

test.describe('Product', () => {
  let product1 = null;
  let product2 = null;
  const products = [];

  let collection1 = null;
  let collection2 = null;
  const collections = [];

  test.beforeAll(async ({ requestUtils, admin }) => {
    // Insert some product collections.
    collection1 = createProductCollection(requestUtils, 'Collection 1');
    collection2 = createProductCollection(requestUtils, 'Collection 2');
    collections.push(collection1, collection2);

    // Insert some products.
    product1 = createProduct(requestUtils, {
      name: 'Product 1',
      status: 'published',
      amount: 1000,
      image_url: 'https://placehold.co/600x400/EEE/31343C',
      product_collection_ids: [collection1.id],
    });

    // Wait for 1 second, so that sorting will be different.
    setTimeout(() => {
      product2 = createProduct(requestUtils, {
        name: 'Product 2',
        status: 'published',
        amount: 2000,
        scratch_amount: 3000,
        product_collection_ids: [collection2.id],
      });
    }, 1000);
    products.push(product1, product2);

    // Go to permalink settings page and set the shop page.
    await admin.page.goto('/wp-admin/options-permalink.php');

    // Click on Post name radio button permalink.
    await admin.page.getByText('Post name').click();

    // Click on Save Changes button.
    await admin.page.locator('input[type="submit"]').click();
  });

  test('Should render product list page', async ({ page }) => {
    await page.goto('/shop');
    await page.waitForTimeout(3000);

    await expect(page.locator('h1')).toHaveText('Shop');

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
    await page.waitForTimeout(3000);

    await page.getByPlaceholder('Search').fill('Product 2');
    await page.click('.search-button');
    await page.waitForTimeout(3000);

    // Check if Product 2 is showing in the list.
    const productTitlesAfterSearch = await page.locator('sc-product-item-title');
    const firstProductTextAfterSearch = await productTitlesAfterSearch.innerText();
    await expect(firstProductTextAfterSearch).toBe('Product 2');
  });

  test('Should clear search product', async ({ page }) => {
    await page.goto('/shop');
    await page.waitForTimeout(3000);

    await page.getByPlaceholder('Search').fill('Product 2');
    await page.click('.search-button');
    await page.waitForTimeout(3000);

    await page.click('.tag--clearable');
    await page.waitForTimeout(3000);
    await page.getByPlaceholder('Search').fill('Other');
    await page.click('.search-button');
    await page.waitForTimeout(3000);
  });

  test('Sort Product by order', async ({ page }) => {
    await page.goto('/shop');
    await page.waitForTimeout(3000);

    // Test with Alphabetical ascending sorting.
    await page.click('.product-item-list__sort sc-dropdown');
    await page.click('text=Alphabetical, A-Z');
    await page.waitForTimeout(3000);

    // Check if Product 1 and Product 2 are showing in the list.
    const productTitles = await page.locator('sc-product-item-title');

    // Get the text content of each element
    const firstProductText = await productTitles.nth(0).innerText();
    const secondProductText = await productTitles.nth(1).innerText();

    // Check if Product 1 and Product 2 are showing in the list
    await expect(firstProductText).toBe('Product 1');
    await expect(secondProductText).toBe('Product 2');

    // Test with Alphabetical descending sorting.
    await page.locator('.product-item-list__sort sc-dropdown').getByText('Dropdown to sort products. Alphabetical, A-Z selected.LatestOldestAlphabetical, ').click();
    await page.click('text=Alphabetical, Z-A');
    await page.waitForTimeout(3000);
    // await page.waitForTimeout(3000);
    const productTitlesAfterAlphaDescendingSort = await page.locator('sc-product-item-title');
    const firstProductTextAfterAlphaDescendingSort = await productTitlesAfterAlphaDescendingSort.nth(0).innerText();
    const secondProductTextAfterAlphaDescendingSort = await productTitlesAfterAlphaDescendingSort.nth(1).innerText();
    await expect(firstProductTextAfterAlphaDescendingSort).toBe('Product 2');
    await expect(secondProductTextAfterAlphaDescendingSort).toBe('Product 1');
  });

  test('Should see product price', async ({ page }) => {
    await page.goto('/shop');
    await page.waitForTimeout(3000);

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
    await page.waitForTimeout(3000);

    // Check if Product 1 and Product 2 are showing in the list.
    const productImages = await page.locator('sc-product-item-image .product-img img');

    // Get the text content of each element
    const firstProductImage = await productImages.nth(0).getAttribute('src');
    await expect(firstProductImage).toBe('https://placehold.co/600x400/EEE/31343C');
  });

  test('Should filter by product collection', async ({ page }) => {
    await page.goto('/shop');
    await page.waitForTimeout(3000);

    const collectionFilters = await page.locator('.product-item-list__sort sc-dropdown');

    // Get the text content of each element
    await collectionFilters.nth(1).click();

    // Click on Collection 1.
    await page.click('text=Collection 1');
    await page.waitForTimeout(3000);

    // Check if Product 1 is showing in the list.
    const productTitles = await page.locator('sc-product-item-title');
    const firstProductText = await productTitles.innerText();
    await expect(firstProductText).toBe('Product 1');

    // Clear Collection filter.
    await page.locator('sc-tag').getByText('Collection 1', { exact: true }).click();
    await page.waitForTimeout(3000);
    const productTitlesAfterClearFilter = await page.locator('sc-product-item-title');
    const firstProductTextAfterClearFilter = await productTitlesAfterClearFilter.innerText();
    await expect(firstProductTextAfterClearFilter).toBe('Product 1');
  });

  test('Product detil page - Should visible all default block fields', async ({ page }) => {
    await page.goto('/products/product-1');
    await page.waitForTimeout(3000);

    // Product 1 heading text.
    await expect(page.locator('h1')).toHaveText('Product 1');

    // Product 1 price.
    await expect(page.locator('sc-format-number')).toHaveText('$10');

    // Product 1 image.
    await expect(page.locator('.wp-block-surecart-product-media img')).toHaveAttribute('src', 'https://placehold.co/600x400/EEE/31343C');

    // Quantity Selection is Present there.
    await expect(page.locator('sc-quantity-select')).toBeVisible();

    const addToCartButtons = await page.locator('sc-product-buy-button a span');

    const addToCartButtonText = (await addToCartButtons.nth(0).innerText()).trim();
    const buyButtonText = (await addToCartButtons.nth(1).innerText()).trim();

    await expect(addToCartButtonText).toBe('Add To Cart');
    await expect(buyButtonText).toBe('Buy Now');
  });

  test('Product collection page', async ({ page }) => {
    await page.goto('/collections/collection-1');
    await page.waitForTimeout(3000);

    await expect(page.locator('h2')).toHaveText('Collection 1');
    await page.waitForTimeout(3000);

    // Check if Product 1 are showing in the list.
    const productTitles = await page.locator('sc-product-item-title');
    const firstProductText = await productTitles.innerText();
    await expect(firstProductText).toBe('Product 1');
  });
});

export const createProductCollection = async (requestUtils, collectionName) => {
  try {
    return await requestUtils.rest({
      method: 'POST',
      path: API_PRODUCT_COLLECTIO_PATH,
      data: {
        name: collectionName,
      },
    });
  } catch (error) {
    if (error.response?.data?.code === 'product_collection.name.taken') {
      // Fetch and return the existing collection.
      return await requestUtils.rest({
        method: 'GET',
        path: API_PRODUCT_COLLECTIO_PATH + '?query=' + collectionName,
      });
    }
  }
};

export const createProduct = async (requestUtils, data) => {
  let product = null;
  let needsCreatePriceImage = true;

  // Check first if same product is found.
  const existingProduct = await requestUtils.rest({
    method: 'GET',
    path: API_BASE_PATH + '?query=' + data.name,
  });

  if (existingProduct.length) {
    product = existingProduct[0];
    needsCreatePriceImage = false;
  }

  if (!product) {
    product = await requestUtils.rest({
      method: 'POST',
      path: API_BASE_PATH,
      data: {
        name: data.name,
        status: data.status,
        product_collections: data?.product_collection_ids || [],
      },
    });
  }

  // Create a product media.
  if (data.image_url && needsCreatePriceImage) {
    await requestUtils.rest({
      method: 'POST',
      path: API_MEDIA_PATH,
      data: {
        product_id: product.id,
        url: data.image_url,
      },
    });
  }

  // Create a product price.
  if (needsCreatePriceImage) {
    await requestUtils.rest({
      method: 'POST',
      path: API_PRICE_PATH,
      data: {
        amount: data?.amount || '0',
        product: product.id,
        name: data?.price_name || 'One Time',
        ...(data?.scratch_amount && { scratch_amount: data.scratch_amount }),
      },
    });
  }

  return product;
};
