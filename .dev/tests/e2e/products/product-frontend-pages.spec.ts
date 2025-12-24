/**
 * WordPress dependencies.
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies.
 */
import { create as createAccount } from '../provisional-account';
import {
	PRODUCT_API_PATH,
	PRODUCT_MEDIA_API_PATH,
	PRICE_API_PATH,
	PRODUCT_COLLECTION_API_PATH
} from '../request-utils/endpoints';

test.describe('Product', () => {
	let collection1 = null;
	let collection2 = null;
	let product1 = {};

	test.beforeEach(async ({ requestUtils }) => {
		await createAccount(requestUtils);

		// Insert some product collections.
		collection1 = await getOrCreateProductCollection(requestUtils, 'Collection 1');
		collection2 = await getOrCreateProductCollection(requestUtils, 'Collection 2');

		// Insert some products.
		product1 = await createProduct(requestUtils, {
			name: 'Product 1',
			status: 'published',
			amount: 1000,
			image_url: 'https://placehold.co/600x400/EEE/31343C',
			product_collection_ids: [collection1?.id],
		});

		await createProduct(requestUtils, {
			name: 'Product 2',
			status: 'published',
			amount: 2000,
			scratch_amount: 3000,
			product_collection_ids: [collection2.id],
		});
	});

	test('Product page - Product List', async ({ page }) => {
		await page.goto('/shop');
		await page.waitForLoadState('networkidle');

		// Test: Check if the Shop heading is showing.
		await expect(page.locator('h1')).toHaveText('Shop');

		// Test: Check if there is 2 .wp-block-surecart-product-title in the page.
		await expect(page.locator('.wp-block-surecart-product-title')).toHaveCount(2);

		// Test: Search Product list.
		await page.getByPlaceholder('Search').fill('Product 2');
		await page.getByPlaceholder('Search').press('Enter');
		await page.waitForLoadState('networkidle');

		// Test: if only 1 product is showing in the list.
		await expect(page.locator('.wp-block-surecart-product-title')).toHaveCount(1);

		// Test: Clear search.
		await page.getByPlaceholder('Search').fill('');
		await page.getByPlaceholder('Search').press('Enter');
		await page.waitForLoadState('networkidle');

		// Test: Alphabetical descending sorting.
		await page.getByRole('radio', { name: 'Alphabetical, Z-A', exact: true }).click();
		await page.waitForLoadState('networkidle');

		// Test: if Product 1 and Product 2 are showing in the list in the Z-A order.
		await expect(page.locator('.wp-block-surecart-product-title').nth(0)).toHaveText('Product 2');
		await expect(page.locator('.wp-block-surecart-product-title').nth(1)).toHaveText('Product 1');

		// Test: Alphabetical ascending sorting.
		await page.getByRole('radio', { name: 'Alphabetical, A-Z', exact: true }).click();
		await page.waitForLoadState('networkidle');

		// Test: if Product 1 and Product 2 are showing in the list in the A-Z order.
		await expect(page.locator('.wp-block-surecart-product-title').nth(0)).toHaveText('Product 1');
		await expect(page.locator('.wp-block-surecart-product-title').nth(1)).toHaveText('Product 2');

		// Test: if Product 1 and Product 2 prices are correct.
		await expect(page.locator('.wp-block-surecart-product-list-price').nth(0)).toHaveText('$10');
		await expect(page.locator('.wp-block-surecart-product-list-price').nth(1)).toHaveText('$20');

		// Test: Product image.
		// Check if Product 1 is showing with an image (Product 2 has no image in current UI).
		await expect(
			await page
				.locator('.wp-block-cover__image-background')
				.first()
				.getAttribute('src')
		).toBe('https://placehold.co/600x400/EEE/31343C');

		// Check Collection 1 and Collection 2 filters are present.
		await expect(page.getByRole('checkbox', { name: 'Collection 1' })).toBeVisible();
		await expect(page.getByRole('checkbox', { name: 'Collection 2' })).toBeVisible();
	});

	test('Product page - Product Detail', async ({ page }) => {
		await page.goto(product1?.permalink ?? '/products/product-1');

		// Product 1 heading text.
		await expect(page.getByLabel('Product 1')).toHaveText('Product 1');

		// Product 1 price.
		await expect(page.locator('[data-wp-text="state.selectedDisplayAmount"]')).toHaveText('$10');

		// Product 1 image.
		await expect(
			page.locator('.wp-block-surecart-product-media img')
		).toHaveAttribute('src', 'https://placehold.co/600x400/EEE/31343C');

		// Quantity Selection is Present there.
		await expect(page.locator('.wp-block-surecart-product-quantity .sc-quantity-selector')).toBeVisible();

		const addToCartButtons = await page.locator(
			'.wp-block-surecart-product-buy-button button'
		);

		const addToCartButtonText = (
			await addToCartButtons.nth(0).innerText()
		).trim();
		const buyButtonText = (
			await addToCartButtons.nth(1).innerText()
		).trim();

		await expect(addToCartButtonText).toBe('Add To Cart');
		await expect(buyButtonText).toBe('Buy Now');
	});

	test('Product page - Product Collection', async ({ page }) => {
		await page.goto('/collections/collection-1');
		await page.waitForLoadState('networkidle');

		await expect(
			page.getByRole('heading').getByText('Collection 1', { exact: true })
		).toBeVisible();

		// Check if Product 1 are showing in the list.
		await expect(
			page
				.locator('.wp-block-surecart-product-title')
				.nth(0)
				.getByText('Product 1', { exact: true })
		).toBeVisible();
	});
});

export const getOrCreateProductCollection = async (
	requestUtils,
	collectionName
) => {
	// get existing collection.
	const existingCollections = await requestUtils.rest({
		method: 'GET',
		path: PRODUCT_COLLECTION_API_PATH + '?query=' + collectionName,
	});

	if (existingCollections?.[0]) {
		// Trigger update to ensure collection sync.
		return await requestUtils.rest({
			method: 'PATCH',
			path: PRODUCT_COLLECTION_API_PATH + '/' + existingCollections[0].id,
			data: {
				name: collectionName,
			},
		});
	}

	// create the collection.
	return await requestUtils.rest({
		method: 'POST',
		path: PRODUCT_COLLECTION_API_PATH,
		data: {
			name: collectionName,
		},
	});
};

export const createProduct = async (requestUtils, data) => {
	let product = null;
	let needsCreatePriceImage = true;

	// Check first if same product is found.
	const existingProduct = await requestUtils.rest({
		method: 'GET',
		path: PRODUCT_API_PATH + '?query=' + data.name,
	});

	if (existingProduct.length) {
		product = existingProduct[0];
		needsCreatePriceImage = false;
	}

	if (!product) {
		product = await requestUtils.rest({
			method: 'POST',
			path: PRODUCT_API_PATH,
			data: {
				name: data.name,
				status: data.status,
				product_collections: data?.product_collection_ids || [],
			},
		});
	}

	if (!product?.id) {
		throw new Error('Product not found');
	}

	// Create a product media.
	if (data.image_url && needsCreatePriceImage) {
		await requestUtils.rest({
			method: 'POST',
			path: PRODUCT_MEDIA_API_PATH,
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
			path: PRICE_API_PATH,
			data: {
				amount: data?.amount || '0',
				product: product.id,
				name: data?.price_name || 'One Time',
				...(data?.scratch_amount && {
					scratch_amount: data.scratch_amount,
				}),
			},
		});
	}

	return product;
};
