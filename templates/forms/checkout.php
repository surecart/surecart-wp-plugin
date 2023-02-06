<?php
/**
 * Donation form block pattern
 */
return [
	'title'      => __( 'Checkout', 'surecart' ),
	'categories' => [],
	'blockTypes' => [],
	'content'    => '<!-- wp:surecart/columns {"isFullHeight":true,"isReversedOnMobile":true,"style":{"spacing":{"blockGap":{"top":"0px","left":"0px"}}}} -->
	<sc-columns is-stacked-on-mobile="true" is-full-height="true" is-reversed-on-mobile="true" class="wp-block-surecart-columns" style="gap:0px 0px"><!-- wp:surecart/column {"style":{"spacing":{"padding":{"top":"60px","right":"60px","bottom":"60px","left":"60px"},"blockGap":"30px"}},"layout":{"type":"constrained","contentSize":"500px","justifyContent":"right"}} -->
	<sc-column class="wp-block-surecart-column is-layout-constrained is-horizontally-aligned-right" style="padding-top:60px;padding-right:60px;padding-bottom:60px;padding-left:60px;--sc-column-content-width:500px;--sc-form-row-spacing:30px"><!-- wp:group {"layout":{"inherit":true}} -->
	<div class="wp-block-group"><!-- wp:surecart/store-logo {"width":120,"maxHeight":100,"isLinkToHome":false} /--></div>
	<!-- /wp:group -->

	<!-- wp:surecart/name -->
	<sc-customer-name label="Name" required class="wp-block-surecart-name"></sc-customer-name>
	<!-- /wp:surecart/name -->

	<!-- wp:surecart/email /-->

	<!-- wp:surecart/address /-->

	<!-- wp:surecart/payment {"secure_notice":"This is a secure, encrypted payment"} -->
	<sc-payment label="Payment" default-processor="stripe" secure-notice="This is a secure, encrypted payment" class="wp-block-surecart-payment"></sc-payment>
	<!-- /wp:surecart/payment -->

	<!-- wp:surecart/submit {"show_total":true,"full":true} -->
	<sc-order-submit type="primary" full="true" size="large" icon="lock" show-total="true" class="wp-block-surecart-submit">Purchase</sc-order-submit>
	<!-- /wp:surecart/submit --></sc-column>
	<!-- /wp:surecart/column -->

	<!-- wp:surecart/column {"width":"","style":{"spacing":{"padding":{"top":"60px","right":"60px","bottom":"60px","left":"60px"},"blockGap":"30px"},"color":{"background":"#f3f4f6"},"border":{"color":"#dce0e6","width":"1px"}},"layout":{"type":"constrained","contentSize":"400px","justifyContent":"left"}} -->
	<sc-column class="wp-block-surecart-column is-layout-constrained is-horizontally-aligned-left has-border-color has-background" style="border-color:#dce0e6;border-width:1px;background-color:#f3f4f6;padding-top:60px;padding-right:60px;padding-bottom:60px;padding-left:60px;--sc-column-content-width:400px;--sc-form-row-spacing:30px"><!-- wp:surecart/totals {"collapsible":true} -->
	<sc-order-summary collapsible="1" closed-text="Show Summary" open-text="Summary" collapsed-on-mobile="1" class="wp-block-surecart-totals"><!-- wp:surecart/divider -->
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

	<!-- wp:surecart/coupon -->
	<sc-order-coupon-form label="Add Coupon Code">Apply Coupon</sc-order-coupon-form>
	<!-- /wp:surecart/coupon -->

	<!-- wp:surecart/tax-line-item -->
	<sc-line-item-tax class="wp-block-surecart-tax-line-item"></sc-line-item-tax>
	<!-- /wp:surecart/tax-line-item -->

	<!-- wp:surecart/divider -->
	<sc-divider></sc-divider>
	<!-- /wp:surecart/divider -->

	<!-- wp:surecart/total -->
	<sc-line-item-total total="total" size="large" show-currency="1" class="wp-block-surecart-total"><span slot="title">Total</span><span slot="subscription-title">Total Due Today</span></sc-line-item-total>
	<!-- /wp:surecart/total --></sc-order-summary>
	<!-- /wp:surecart/totals --></sc-column>
	<!-- /wp:surecart/column --></sc-columns>
	<!-- /wp:surecart/columns -->',
];
