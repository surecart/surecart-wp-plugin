/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

test.describe('surecart/product-donation', () => {
	let product;

	test.beforeEach(async ({ admin, requestUtils }) => {
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
				currency: "usd",
				ad_hoc_min_amount: 1000,
				ad_hoc_max_amount: 100000,
				product: product.id,
			},
			{
				position: 1,
				name: 'Monthly',
				ad_hoc: true,
				ad_hoc_min_amount: 1000,
				ad_hoc_max_amount: 10000,
				recurring_interval: 'month',
				recurring_interval_count: 1,
				amount: 1500,
				currency: "usd",
				product: product.id,
			},
			{
				position: 2,
				name: "Every Week",
				ad_hoc: true,
				ad_hoc_min_amount: 1000,
				ad_hoc_max_amount: 5000,
				recurring_interval: "week",
				recurring_interval_count: 1,
				amount: 1500,
				currency: "usd",
				product: product.id,
			},
			{
				position: 2,
				name: "Every Year",
				ad_hoc: true,
				ad_hoc_min_amount: 10000,
				ad_hoc_max_amount: 100000,
				recurring_interval: "year",
				recurring_interval_count: 1,
				amount: 12000,
				currency: "usd",
				product: product.id,
			}
		];

		await Promise.all(
			prices.map((price) =>
				requestUtils.rest({
					method: 'POST',
					path: '/surecart/v1/prices',
					data: price,
				})
			)
		);
		await admin.createNewPost();
	});

	test('Should render donation block on frontend', async ({ editor, page }) => {
		const serializedBlockHTML = `
		<!-- wp:surecart/checkout-form {\"title\":\"Test Form\"} /-->
		<!-- wp:surecart/form {"success_url":"","prices":[]} -->
		<!-- wp:surecart/product-donation {"amount_columns":4,"product_id":"${product.id}","style":{"typography":{"fontSize":"20px","textTransform":"capitalize"},"spacing":{"padding":{"top":"var:preset|spacing|40","bottom":"var:preset|spacing|40","left":"var:preset|spacing|40","right":"var:preset|spacing|40"},"margin":{"top":"var:preset|spacing|30","bottom":"var:preset|spacing|30","left":"var:preset|spacing|30","right":"var:preset|spacing|30"}},"border":{"radius":"18px","width":"6px"}},"borderColor":"vivid-green-cyan","backgroundColor":"ast-global-color-6","textColor":"black"} -->
		<!-- wp:surecart/product-donation-amount {"amount":100,"currency":"USD"} /-->
		<!-- wp:surecart/product-donation-amount {"amount":200,"currency":"USD"} /-->
		<!-- wp:surecart/product-donation-amount {"amount":600,"currency":"USD"} /-->
		<!-- wp:surecart/product-donation-amount {"amount":1000,"currency":"USD"} /-->
		<!-- wp:surecart/product-donation-amount {"amount":2000,"currency":"USD"} /-->
		<!-- wp:surecart/product-donation-amount {"amount":5000,"currency":"USD"} /-->
		<!-- wp:surecart/product-donation-amount {"amount":10000,"currency":"USD"} /-->
		<!-- wp:surecart/product-donation-amount {"amount":20000,"currency":"USD"} /-->
		<!-- wp:surecart/product-donation-amount {"amount":50000,"currency":"USD"} /-->
		<!-- wp:surecart/custom-donation-amount {"currency":"USD"} /-->
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
		<!-- /wp:surecart/checkout-form /-->
		`;
		// Add a predefined content for the page that has Checkout Form & Donation block.
		await editor.setContent(serializedBlockHTML);
		await editor.publishPost();
		await page
			.locator('.components-button.is-primary', { hasText: 'View Post' })
			.click();
		await page.waitForLoadState('networkidle');
		await expect(page.locator('sc-product-donation-choices')).toBeVisible(); // expect the sc-product-donation-choices component to be visible.
		await expect(page.locator('sc-custom-donation-amount')).toBeVisible(); // expect the sc-custom-donation-amount component to be visible.
		await expect(page.locator('sc-product-donation-choices > sc-choice-container[checked]')).toBeVisible(); // Check  if the first choice is checked by default.
		await expect(page.locator('sc-product-donation-choices sc-donation-recurring-choices sc-choice-container[checked]')).toBeVisible(); // Check  if the first recurring choice is checked by default.
		await expect(page.locator('sc-product-donation-choices > .sc-product-donation-choices > sc-choices .form-control label')).toHaveText('Donation Amount'); // Check if the the label of the choices component is correct.
		await expect(page.locator('sc-product-donation-choices > .sc-product-donation-choices > sc-donation-recurring-choices .form-control label')).toHaveText('Make it recurring'); // Check if the the label of the choices component is correct.
		await expect(page.locator('sc-product-donation-choices > .sc-product-donation-choices > sc-donation-recurring-choices sc-recurring-price-choice-container .price-choice__name')).toHaveText('Yes, count me in!'); // Check if the the label of the choices component is correct.
		await expect(page.locator('sc-product-donation-choices > .sc-product-donation-choices > sc-donation-recurring-choices sc-choices > sc-choice-container .price-choice__name')).toHaveText('No, donate once'); // Check if the the label of the choices component is correct.
		// const amountElement = await page.locator('sc-product-donation-choices > sc-choice-container:not([disabled]):not([checked])').first(); 
		// amountElement.click();// Click on any other amount choice.
		// const amountElementValue = await amountElement.getAttribute('value');
		// await expect(page.locator('sc-product-line-item')).toHaveAttribute('value', amountElementValue); // Check if the amount choice is checked.
		

	});
});
