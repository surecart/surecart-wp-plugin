/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe('surecart/product-donation', () => {
	let product;

	test.beforeEach(async ({ requestUtils, page }) => {
		product = await requestUtils.rest({
			method: 'POST',
			path: '/surecart/v1/products',
			data: {
				name: 'Test Donation Product',
				status: 'published',
			},
		});

		const prices = [
			{
				position: 0,
				name: 'One Time',
				ad_hoc: true,
				amount: 2500,
				currency: 'usd',
				ad_hoc_min_amount: 1000,
				ad_hoc_max_amount: 100000,
				product: product.id,
			},
			{
				position: 1,
				name: 'Every Month',
				ad_hoc: true,
				ad_hoc_min_amount: 1000,
				ad_hoc_max_amount: 10000,
				recurring_interval: 'month',
				recurring_interval_count: 1,
				amount: 1500,
				currency: 'usd',
				product: product.id,
			},
			{
				position: 2,
				name: 'Every Week',
				ad_hoc: true,
				ad_hoc_min_amount: 1000,
				ad_hoc_max_amount: 5000,
				recurring_interval: 'week',
				recurring_interval_count: 1,
				amount: 1500,
				currency: 'usd',
				product: product.id,
			},
		];

		await Promise.all(
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

		const serializedBlockHTML = `
		<!-- wp:surecart/form {"success_url":"","prices":[]} -->
		<!-- wp:surecart/product-donation {"product_id":"${product?.id}"} -->
<!-- wp:surecart/product-donation-amounts -->
<!-- wp:surecart/product-donation-amount {"amount":100,"label":"$1.00","currency":"usd"} /-->

<!-- wp:surecart/product-donation-amount {"amount":200,"label":"$2.00","currency":"usd"} /-->

<!-- wp:surecart/product-donation-amount {"amount":500,"label":"$5.00","currency":"usd"} /-->

<!-- wp:surecart/product-donation-amount {"amount":1000,"label":"$10.00","currency":"usd"} /-->

<!-- wp:surecart/product-donation-amount {"amount":2000,"label":"$20.00","currency":"usd"} /-->

<!-- wp:surecart/product-donation-amount {"amount":5000,"label":"$50.00","currency":"usd"} /-->

<!-- wp:surecart/product-donation-amount {"amount":10000,"label":"$100.00","currency":"usd"} /-->

<!-- wp:surecart/product-donation-amount {"amount":20000,"label":"$200.00","currency":"usd"} /-->

<!-- wp:surecart/product-donation-amount {"amount":50000,"label":"$500.00","currency":"usd"} /-->

<!-- wp:surecart/product-donation-custom-amount /-->
<!-- /wp:surecart/product-donation-amounts -->

<!-- wp:surecart/product-donation-prices -->
<!-- wp:surecart/product-donation-price /-->

<!-- wp:surecart/product-donation-price {"label":"No, donate once.","recurring":false} /-->
<!-- /wp:surecart/product-donation-prices -->
<!-- /wp:surecart/product-donation -->
		<!-- wp:surecart/express-payment -->
		<sc-express-payment divider-text="or" class="wp-block-surecart-express-payment"></sc-express-payment>
		<!-- /wp:surecart/express-payment -->
		<!-- wp:surecart/columns -->
		<div class="wp-block-surecart-columns">
		<!-- wp:surecart/column -->
		<div class="wp-block-surecart-column">
			<!-- wp:surecart/email /-->
		</div>
		<!-- /wp:surecart/column -->
		<!-- wp:surecart/column -->
		<div class="wp-block-surecart-column">
			<!-- wp:surecart/name -->
			<sc-customer-name label="Name" class="wp-block-surecart-name"></sc-customer-name>
			<!-- /wp:surecart/name -->
		</div>
		<!-- /wp:surecart/column -->
		</div>
		<!-- /wp:surecart/columns -->
		<!-- wp:surecart/payment {"secure_notice":"This is a secure, encrypted payment"} -->
		<sc-payment label="Payment" default-processor="stripe" secure-notice="This is a secure, encrypted payment" class="wp-block-surecart-payment"></sc-payment>
		<!-- /wp:surecart/payment -->
		<!-- wp:surecart/totals {"collapsible":true} -->
		<sc-order-summary collapsible="1" closed-text="Show Summary" open-text="Summary" class="wp-block-surecart-totals">
		<!-- wp:surecart/divider -->
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
		<!-- wp:surecart/submit {"text":"Donate","show_total":true,"full":true} -->
		<sc-order-submit type="primary" full="true" size="large" icon="lock" show-total="true" secure-notice="true" secure-notice-text="This is a secure, encrypted payment." class="wp-block-surecart-submit">Donate</sc-order-submit>
		<!-- /wp:surecart/submit -->
		<!-- /wp:surecart/form -->
		`;
		const form = await requestUtils.rest({
			method: 'POST',
			path: '/wp/v2/sc-forms',
			data: {
				content: serializedBlockHTML,
				status: 'publish',
			},
		});

		const post = await requestUtils.rest({
			method: 'POST',
			path: '/wp/v2/pages',
			data: {
				content: `<!-- wp:surecart/checkout-form {"id":${form?.id}} /-->`,
			},
		});

		await page.goto(post.link);
	});

	test('Should render donation block components & labels on frontend', async ({
		page,
	}) => {
		await expect(
			page.locator('.wp-block-surecart-product-donation')
		).toBeVisible();
		await expect(
			page.locator('.wp-block-surecart-product-donation-amounts')
		).toBeVisible();
		await expect(
			page.locator('.wp-block-surecart-product-donation-prices')
		).toBeVisible();

		await expect(page.getByText('Donation Amount')).toBeVisible();
		await expect(page.getByText('Make It Recurring')).toBeVisible();

		await expect(page.getByText('Yes, count me in!')).toBeVisible();
		await expect(page.getByText('No, donate once')).toBeVisible();
	});
});
