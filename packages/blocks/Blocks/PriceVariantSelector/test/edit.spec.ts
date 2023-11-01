/**
 * Wordpress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe('surecart/price-variant-selector block editor', () => {
	let product: any = null;

	test.beforeAll(async ({ requestUtils }) => {
		product = await createVariantProduct(requestUtils);
	});

	test('Should allow adding of the variant selector block', async ({
		editor,
		page,
		admin,
	}) => {
		await admin.createNewPost();

		const serializedBlockHTML = `
			<!-- wp:surecart/form {"mode":"test","success_url":""} -->
				<!-- wp:surecart/price-variant-selector /-->
			<!-- /wp:surecart/form -->
		`;

		await editor.setContent(serializedBlockHTML);
		await page.locator('sc-button:has-text("Select Product")').click();
		await page.locator('sc-select[placeholder="Choose product"]').click();
		const menuItem = page
			.locator('.hydrated > sc-dropdown > sc-menu > sc-menu-item')
			.first();
		await menuItem.click();

		await expect(
			page.locator('sc-pill-option:has-text("Small")')
		).toBeVisible();
	});

	test('Should allow modifying attributes like label and product', async ({
		editor,
		page,
		admin,
	}) => {
		await admin.createNewPost();

		const serializedBlockHTML = `
			<!-- wp:surecart/form {"mode":"test","success_url":""} -->
				<!-- wp:surecart/price-variant-selector {"product_id":"${product?.id}"} /-->
			<!-- /wp:surecart/form -->
		`;

		await editor.setContent(serializedBlockHTML);
		await page.locator('div[aria-label="Block: Price Variant Selector"]').click()
		await page
			.locator('.components-base-control__field input')
			.fill('Test Label');
		await page.locator('.components-panel__row sc-select').click();
		await page
			.locator('.hydrated > sc-dropdown > sc-menu > sc-menu-item')
			.first()
			.click();

		await expect(
			page.locator('sc-pill-option:has-text("Small")')
		).not.toBeVisible();

		// check the menu item in the select again and see if product appears
		await page.locator('.components-panel__row sc-select').click();
		await page
			.locator('.hydrated > sc-dropdown > sc-menu > sc-menu-item')
			.first()
			.click();
		await expect(
			page.locator('sc-pill-option:has-text("Small")')
		).toBeVisible();
	});
});

test.describe('surecart/price-variant-selector block frontend', () => {
	let product: any = null;

	test.beforeAll(async ({ requestUtils }) => {
		product = await createVariantProduct(requestUtils);
		await createProductPrice(requestUtils, product?.id);
	});

	test.beforeEach(async ({ page, admin, editor }) => {
		await admin.createNewPost();

		const serializedBlockHTML = `
			<!-- wp:surecart/checkout-form {\"title\":\"Test Form\"} /-->
				<!-- wp:surecart/form {"mode":"test","success_url":""} -->
					<!-- wp:surecart/price-variant-selector {"product_id":"${product?.id}"}  /-->
					<!-- wp:surecart/totals -->
						<sc-order-summary closed-text="Show Summary" open-text="Summary" class="wp-block-surecart-totals"><!-- wp:surecart/divider -->
							<sc-divider></sc-divider>
							<!-- /wp:surecart/divider -->

							<!-- wp:surecart/line-items -->
							<sc-line-items removable="1" editable="1" class="wp-block-surecart-line-items"></sc-line-items>
							<!-- /wp:surecart/line-items -->

							<!-- wp:surecart/divider -->
							<sc-divider></sc-divider>
							<!-- /wp:surecart/divider -->

							<!-- wp:surecart/subtotal -->
							<sc-line-item-total total="subtotal" class="wp-block-surecart-subtotal"><span slot="description">Subtotal</span></sc-line-item-total>
							<!-- /wp:surecart/subtotal -->

							<!-- wp:surecart/coupon {"button_text":"Apply Coupon"} /-->

							<!-- wp:surecart/line-item-shipping -->
							<sc-line-item-shipping label="Shipping" class="wp-block-surecart-line-item-shipping"></sc-line-item-shipping>
							<!-- /wp:surecart/line-item-shipping -->

							<!-- wp:surecart/tax-line-item -->
							<sc-line-item-tax class="wp-block-surecart-tax-line-item"></sc-line-item-tax>
							<!-- /wp:surecart/tax-line-item -->

							<!-- wp:surecart/divider -->
							<sc-divider></sc-divider>
							<!-- /wp:surecart/divider -->

							<!-- wp:surecart/total -->
							<sc-line-item-total total="total" size="large" show-currency="1" class="wp-block-surecart-total"><span slot="title">Total</span><span slot="subscription-title">Total Due Today</span></sc-line-item-total>
							<!-- /wp:surecart/total -->
						</sc-order-summary>
					<!-- /wp:surecart/totals -->
					<!-- wp:surecart/submit -->
						<sc-order-submit type="primary" size="large" icon="lock" secure-notice="true" secure-notice-text="This is a secure, encrypted payment." class="wp-block-surecart-submit">Purchase</sc-order-submit>
					<!-- /wp:surecart/submit -->
				<!-- /wp:surecart/form -->
			<!-- /wp:surecart/checkout-form /-->
		`;

		await editor.setContent(serializedBlockHTML);
		await editor.publishPost();

		await page
			.locator('.components-button.is-primary', { hasText: 'View Post' })
			.click();
		await page.waitForLoadState('networkidle');
	});

	test('Should show the variant selector', async ({ page }) => {
		const smallPillOption = page.locator(
			'sc-pill-option:has-text("Small")'
		);
		const redPillOption = page.locator('sc-pill-option:has-text("Red")');

		// ensure that the small pill and red pill are visible
		await expect(smallPillOption).toBeVisible();
		await expect(redPillOption).toBeVisible();

		// ensure that the small pill is selected and the red pill is not
		await expect(
			smallPillOption.locator('button.sc-pill-option__button--selected')
		).toBeVisible();
		await expect(
			redPillOption.locator('button.sc-pill-option__button--selected')
		).not.toBeVisible();

		// ensure that the product is added to cart
		await expect(
			page.locator('sc-line-items:has-text("Test Product")')
		).toBeVisible();
	});

	test('Should allow modification of variant options in checkout', async ({
		page,
	}) => {
		const redPillOption = page.locator('sc-pill-option:has-text("Red")');
		await redPillOption.click();
		await page.waitForLoadState('networkidle');

		// ensure that the red pill is selected
		await expect(
			redPillOption.locator('button.sc-pill-option__button--selected')
		).toBeVisible();

		// ensure that the variant is updated in the checkout
		await expect(
			page.locator('sc-line-items:has-text("Small / Red")')
		).toBeVisible();

		const largePillOption = page.locator(
			'sc-pill-option:has-text("Large")'
		);
		await largePillOption.click();
		await page.waitForLoadState('networkidle');

		// ensure that the large pill is selected
		await expect(
			largePillOption.locator('button.sc-pill-option__button--selected')
		).toBeVisible();

		// ensure that the variant is updated in the checkout
		await expect(
			page.locator('sc-line-items:has-text("Large / Red")')
		).toBeVisible();
	});

	test('Should perform validation on options selected', async ({ page }) => {
		const removeItemButton = page.locator(
			'sc-line-items sc-product-line-item .item__suffix sc-icon'
		);
		await removeItemButton.click();
		await page.waitForLoadState('networkidle');

		const purchaseButton = page.locator('sc-button:has-text("Purchase")');
		await purchaseButton.click();

		const variantSelector = page.locator('sc-checkout-product-price-variant-selector')
		expect(await variantSelector.evaluate((node:any)=>  node?.reportValidity())).toBe(false);
	});

	test('Should prevent adding a product to cart if the variant is deleted', async ({page, requestUtils }) => {
		await expect(
			page.locator('sc-pill-option:has-text("Black") button')
		).not.toHaveClass('sc-pill-option__button--disabled');
		let updatedVariants = (product?.variants||[]);
		updatedVariants.shift();

		await deleteProductVariant(requestUtils, product?.id, updatedVariants);
		await page.reload();
		await page.waitForLoadState('networkidle');

		await expect(
			page.locator('sc-pill-option:has-text("Black") button.sc-pill-option__button--disabled')
		).toBeVisible();
	 })
});

export const deleteProductVariant = async (requestUtils, productId: string, variants) => {
	return requestUtils.rest({
		method: 'PATCH',
		path: `/surecart/v1/products/${productId}`,
		data: {
			variants: variants
		},
	})
}

export const createProductPrice = async (requestUtils, productId: string) => {
	return requestUtils.rest({
		method: 'POST',
		path: '/surecart/v1/prices',
		data: {
			amount: '2000.00',
			name: 'Basic',
			product: productId,
			recurring_end_behavior: null,
			recurring_interval: null,
			recurring_interval_count: null,
			recurring_period_count: null,
			scratch_amount: '2100.00',
		},
	});
};

export const createVariantProduct = async (requestUtils) => {
	return requestUtils.rest({
		method: 'POST',
		path: '/surecart/v1/products',
		data: {
			name: 'Test Product',
			variant_options: [
				{ name: 'Size', position: 0 },
				{ name: 'Color', position: 1 },
			],
			variants: [
				{
					option_1: 'Small',
					option_2: 'Black',
					position: 1,
					amount: '2000.00',
				},
				{
					option_1: 'Small',
					option_2: 'Red',
					position: 2,
					amount: '3000.00',
				},
				{
					option_1: 'Small',
					option_2: 'White',
					position: 3,
					amount: '4000.00',
				},
				{
					option_1: 'Small',
					option_2: 'Blue',
					position: 4,
					amount: '5000.00',
				},
				{
					option_1: 'Large',
					option_2: 'Black',
					position: 5,
					amount: '6000.00',
				},
				{
					option_1: 'Large',
					option_2: 'Red',
					position: 6,
					amount: '7000.00',
				},
				{
					option_1: 'Large',
					option_2: 'White',
					position: 7,
					amount: '8000.00',
				},
				{
					option_1: 'Large',
					option_2: 'Blue',
					position: 8,
					amount: '9000.00',
				},
			],
		},
	});
};
