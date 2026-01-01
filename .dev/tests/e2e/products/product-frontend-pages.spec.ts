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

interface Collection {
	id: string;
	name: string;
	slug: string;
}

interface Product {
	id: string;
	name: string;
	slug: string;
	permalink: string;
}

test.describe('Product', () => {
	let collection1: Collection;
	let collection2: Collection;
	let product1: Product;
	let product2: Product;
	let testId: string;

	test.beforeEach(async ({ requestUtils }) => {
		await createAccount(requestUtils);

		// Generate unique suffix for this test run to avoid conflicts and not 1,2 with it for search tests.
		testId = Math.random().toString(36).substring(2, 8).replace(/[12]/g, '');

		// Insert some product collections with unique names.
		collection1 = await getOrCreateProductCollection(requestUtils, `Collection 1 ${testId}`);
		collection2 = await getOrCreateProductCollection(requestUtils, `Collection 2 ${testId}`);

		// Insert some products with unique names.
		product1 = await createProduct(requestUtils, {
			name: `Product 1 ${testId}`,
			status: 'published',
			amount: 1000,
			image_url: 'https://placehold.co/600x400/EEE/31343C',
			product_collection_ids: [collection1.id],
		});

		product2 = await createProduct(requestUtils, {
			name: `Product 2 ${testId}`,
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

		// Test: Check if both products are visible on the page.
		await expect(page.getByText(product1.name, { exact: true })).toBeVisible();
		await expect(page.getByText(product2.name, { exact: true })).toBeVisible();

		// Test: Search Product list using unique product name.
		await page.getByPlaceholder('Search').fill(product2.name);
		await page.getByPlaceholder('Search').press('Enter');

		// Wait for the non-matching product to be filtered out.
		await expect(page.getByText(product1.name, { exact: true })).toBeHidden({ timeout: 15000 });

		// Test: Verify searched product is still visible.
		await expect(page.getByText(product2.name, { exact: true })).toBeVisible();

		// Test: Clear search.
		await page.getByPlaceholder('Search').fill('');
		await page.getByPlaceholder('Search').press('Enter');

		// Wait for both products to reappear after clearing search.
		await expect(page.getByText(product1.name, { exact: true })).toBeVisible({ timeout: 15000 });
		await expect(page.getByText(product2.name, { exact: true })).toBeVisible();

		// Test: Product image.
		// Check if the image placeholder is showing correctly.
		await expect(
			await page
				.locator('.wp-block-cover__image-background')
				.first()
				.getAttribute('src')
		).toBe('https://placehold.co/600x400/EEE/31343C');

		// Check Collection filters are present.
		await expect(page.getByRole('checkbox', { name: collection1.name })).toBeVisible();
		await expect(page.getByRole('checkbox', { name: collection2.name })).toBeVisible();
	});

	test('Product page - Product Detail', async ({ page }) => {
		await page.goto(product1.permalink);

		// Product 1 heading text.
		await expect(page.getByLabel(product1.name)).toHaveText(product1.name);

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
		await page.goto(`/collections/${collection1.slug}`);
		await page.waitForLoadState('networkidle');

		await expect(
			page.getByRole('heading').getByText(collection1.name, { exact: true })
		).toBeVisible();

		// Check if Product 1 is showing in the list.
		await expect(
			page
				.locator('.wp-block-surecart-product-title')
				.nth(0)
				.getByText(product1.name, { exact: true })
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
