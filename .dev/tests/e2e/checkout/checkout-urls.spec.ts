/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';
import { create as createAccount } from '../provisional-account';
import { addQueryArgs } from '@wordpress/url';

interface Post {
	link: string;
}

interface Form {
	id: number;
}

test.describe('Checkout Urls', () => {
	let product, persisted = {
		form: {} as Form,
		post: {} as Post,
		blocks: '',
	},
	unpersisted = {
		form: {} as Form,
		post: {} as Post,
		blocks: '',
	},
	prices;

	test.beforeEach(async ({ requestUtils, page }) => {
		await createAccount(requestUtils);

		product = await requestUtils.rest({
			method: 'POST',
			path: '/surecart/v1/products',
			data: {
				name: 'Test URL Product',
				status: 'published',
			},
		});

		prices = [
			{
				position: 0,
				name: 'One Time',
				ad_hoc: false,
				amount: 2500,
				currency: 'usd',
				product: product.id,
			},
			{
				position: 1,
				name: 'Every Month',
				ad_hoc: false,
				recurring_interval: 'month',
				recurring_interval_count: 1,
				amount: 1500,
				currency: 'usd',
				product: product.id,
			}
		];

		const priceResponses = await Promise.all(
			prices.map((price) =>
				requestUtils.rest({
					method: 'POST',
					path: '/surecart/v1/prices',
					data: price,
				})
			)
		).catch((e) => {
			console.error(e);
		});

		prices = priceResponses;

		persisted.blocks = `
		<!-- wp:surecart/form {"mode":"test","success_url":"","prices":[],"persist_cart":"browser","lock":{"move":false,"remove":false}} -->
<!-- wp:surecart/email /-->

<!-- wp:surecart/payment {"secure_notice":"This is a secure, encrypted payment"} -->
<sc-payment label="Payment" default-processor="stripe" secure-notice="This is a secure, encrypted payment" class="wp-block-surecart-payment"></sc-payment>
<!-- /wp:surecart/payment -->

<!-- wp:surecart/totals {"collapsible":true} -->
<sc-order-summary collapsible="1" order-summary-text="Summary" invoice-summary-text="Invoice Summary" class="wp-block-surecart-totals"><!-- wp:surecart/divider -->
<sc-divider></sc-divider>
<!-- /wp:surecart/divider -->

<!-- wp:surecart/line-items -->
<sc-line-items removable="1" editable="1" class="wp-block-surecart-line-items"></sc-line-items>
<!-- /wp:surecart/line-items -->

<!-- wp:surecart/divider -->
<sc-divider></sc-divider>
<!-- /wp:surecart/divider -->

<!-- wp:surecart/subtotal -->
<sc-line-item-total total="subtotal" class="wp-block-surecart-subtotal"><span slot="description">Subtotal</span><span slot="total-payments-description">Total Installment Payments</span><span slot="first-payment-subtotal-description">Initial Payment</span></sc-line-item-total>
<!-- /wp:surecart/subtotal -->

<!-- wp:surecart/trial-line-item /-->

<!-- wp:surecart/coupon {"button_text":"Apply Coupon"} /-->

<!-- wp:surecart/tax-line-item -->
<sc-line-item-tax class="wp-block-surecart-tax-line-item"></sc-line-item-tax>
<!-- /wp:surecart/tax-line-item -->

<!-- wp:surecart/divider -->
<sc-divider></sc-divider>
<!-- /wp:surecart/divider -->

<!-- wp:surecart/total -->
<sc-line-item-total total="total" size="large" show-currency="1" class="wp-block-surecart-total"><span slot="title">Total</span><span slot="subscription-title">Total Due Today</span><span slot="first-payment-total-description">Subtotal</span><span slot="free-trial-description">Trial</span><span slot="due-amount-description">Amount Due</span></sc-line-item-total>
<!-- /wp:surecart/total --></sc-order-summary>
<!-- /wp:surecart/totals -->

<!-- wp:surecart/submit {"full":true} -->
<sc-order-submit type="primary" full="true" size="large" icon="lock" secure-notice="true" secure-notice-text="This is a secure, encrypted payment." class="wp-block-surecart-submit">Purchase</sc-order-submit>
<!-- /wp:surecart/submit -->
<!-- /wp:surecart/form -->
		`;

		unpersisted.blocks = `
		<!-- wp:surecart/form {"mode":"test","success_url":"","prices":[],"lock":{"move":false,"remove":false}} -->
		<!-- wp:surecart/email /-->

<!-- wp:surecart/payment {"secure_notice":"This is a secure, encrypted payment"} -->
<sc-payment label="Payment" default-processor="stripe" secure-notice="This is a secure, encrypted payment" class="wp-block-surecart-payment"></sc-payment>
<!-- /wp:surecart/payment -->

<!-- wp:surecart/totals {"collapsible":true} -->
<sc-order-summary collapsible="1" order-summary-text="Summary" invoice-summary-text="Invoice Summary" class="wp-block-surecart-totals"><!-- wp:surecart/divider -->
<sc-divider></sc-divider>
<!-- /wp:surecart/divider -->

<!-- wp:surecart/line-items -->
<sc-line-items removable="1" editable="1" class="wp-block-surecart-line-items"></sc-line-items>
<!-- /wp:surecart/line-items -->

<!-- wp:surecart/divider -->
<sc-divider></sc-divider>
<!-- /wp:surecart/divider -->

<!-- wp:surecart/subtotal -->
<sc-line-item-total total="subtotal" class="wp-block-surecart-subtotal"><span slot="description">Subtotal</span><span slot="total-payments-description">Total Installment Payments</span><span slot="first-payment-subtotal-description">Initial Payment</span></sc-line-item-total>
<!-- /wp:surecart/subtotal -->

<!-- wp:surecart/trial-line-item /-->

<!-- wp:surecart/coupon {"button_text":"Apply Coupon"} /-->

<!-- wp:surecart/tax-line-item -->
<sc-line-item-tax class="wp-block-surecart-tax-line-item"></sc-line-item-tax>
<!-- /wp:surecart/tax-line-item -->

<!-- wp:surecart/divider -->
<sc-divider></sc-divider>
<!-- /wp:surecart/divider -->

<!-- wp:surecart/total -->
<sc-line-item-total total="total" size="large" show-currency="1" class="wp-block-surecart-total"><span slot="title">Total</span><span slot="subscription-title">Total Due Today</span><span slot="first-payment-total-description">Subtotal</span><span slot="free-trial-description">Trial</span><span slot="due-amount-description">Amount Due</span></sc-line-item-total>
<!-- /wp:surecart/total --></sc-order-summary>
<!-- /wp:surecart/totals -->

<!-- wp:surecart/submit {"full":true} -->
<sc-order-submit type="primary" full="true" size="large" icon="lock" secure-notice="true" secure-notice-text="This is a secure, encrypted payment." class="wp-block-surecart-submit">Purchase</sc-order-submit>
<!-- /wp:surecart/submit -->
<!-- /wp:surecart/form -->
		`;

		persisted.form = await requestUtils.rest({
			method: 'POST',
			path: '/wp/v2/sc-forms',
			data: {
				content: persisted.blocks,
				status: 'publish',
			},
		});

		unpersisted.form = await requestUtils.rest({
			method: 'POST',
			path: '/wp/v2/sc-forms',
			data: {
				content: unpersisted.blocks,
				status: 'publish',
			},
		});

		persisted.post = await requestUtils.rest({
			method: 'POST',
			path: '/wp/v2/pages',
			data: {
				content: `<!-- wp:surecart/checkout-form {"id":${persisted.form?.id}} /-->`,
			},
		});

		unpersisted.post = await requestUtils.rest({
			method: 'POST',
			path: '/wp/v2/pages',
			data: {
				content: `<!-- wp:surecart/checkout-form {"id":${unpersisted.form?.id}} /-->`,
			},
		});
	});

	test('Should render initial line items (persisted)', async ({
		page,
	}) => {
		await page.goto('/');
		await page.evaluate(() => window.localStorage.clear());

		await page.goto(addQueryArgs(persisted.post.link, {
			line_items: [
				{
					price_id: prices[0].id,
				}
			]
		}));

		await expect(page.getByText('Test URL Product')).toBeVisible();

		// page url should not have checkout id
		expect(page.url()).not.toContain('checkout_id');

		// reload without checkout id
		await page.reload();

		// page url should not have checkout id
		await expect(page.getByText('Test URL Product')).toBeVisible();
	});

	test('Should render initial line items (unpersisted)', async ({
		page,
	}) => {
		await page.goto('/');
		await page.evaluate(() => window.localStorage.clear());

		await page.goto(addQueryArgs(unpersisted.post.link, {
			line_items: [
				{
					price_id: prices[0].id,
				}
			]
		}));

		await expect(page.getByText('Test URL Product')).toBeVisible();

		// page url should not have checkout id
		expect(page.url()).toContain('checkout_id');

		// reload without checkout id
		await page.reload();

		// page url should not have checkout id
		expect(page.url()).toContain('checkout_id');

		// page url should not have checkout id
		await expect(page.getByText('Test URL Product')).toBeVisible();
	});

	test('Should replace and not add to the cart', async ({
		page,
	}) => {
		await page.goto('/');
		await page.evaluate(() => window.localStorage.clear());

		// reload with different line items
		await page.goto(addQueryArgs(persisted.post.link, {
			line_items: [
				{
					price_id: prices[0].id,
				}
			]
		}));

		await expect(page.getByText('Test URL Product')).toBeVisible();

		// Check initial quantity is 1
		await expect(page.locator('sc-quantity-select')).toHaveAttribute('quantity', '1');

		// reload with different line items
		await page.goto(addQueryArgs(persisted.post.link, {
			line_items: [
				{
					price_id: prices[0].id,
				}
			]
		}));

		// Check initial quantity is 1
		await expect(page.locator('sc-quantity-select')).toHaveAttribute('quantity', '1');
	});
});

