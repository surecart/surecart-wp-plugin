/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

const API_BASE_PATH = '/surecart/v1/products';
const API_PRICE_PATH = '/surecart/v1/prices';
const API_PRODUCT_COLLECTION_BASE_PATH = '/surecart/v1/product_collections';

test.describe('Product List Page', () => {
  let products = [];
  let product1 = null;
  let product2 = null;

  // Insert some products
  test.beforeAll(async ({ requestUtils }) => {
    product1 = createProduct(requestUtils, {
      name: 'Product 1',
      status: 'published',
      amount: 1000,
    });

    product2 = createProduct(requestUtils, {
      name: 'Product 2',
      status: 'published',
      amount: 2000,
      scratch_amount: 3000,
    });

    products.push(product1, product2);
  });

  test('Should render product list page', async ({ page }) => {
    await page.goto('/shop');

    // Test Products is showing in List.
    await expect(page.locator('h1')).toHaveText('Shop');

    // Check if Product 1 and Product 2 are showing in the list.
    await expect(page.locator('sc-product-item-title').getByText('Product 1')).toBeVisible();
    await expect(page.locator('sc-product-item-title').getByText('Product 2')).toBeVisible();
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
