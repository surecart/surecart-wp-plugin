<?php
/**
 * Donation form block pattern
 */
return [
	'title'      => __( 'Checkout', 'surecart' ),
	'categories' => [],
	'blockTypes' => [],
	'content'    => '<!-- wp:surecart/columns {"isFullHeight":true,"backgroundColor":"ast-global-color-5","style":{"spacing":{"blockGap":{"top":"0","left":"0"}}}} -->
	<sc-columns is-stacked-on-mobile="true" is-full-height="true" is-reversed-on-mobile="false" class="wp-block-surecart-columns has-ast-global-color-5-background-color has-background" style="gap:0 0"><!-- wp:surecart/column {"style":{"spacing":{"padding":{"top":"var:preset|spacing|80","right":"var:preset|spacing|60","bottom":"var:preset|spacing|80","left":"var:preset|spacing|60"}}},"layout":{"type":"constrained","contentSize":"450px","justifyContent":"right"}} -->
	<sc-column class="wp-block-surecart-column is-layout-constrained is-horizontally-aligned-right" style="padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--60);--sc-column-content-width:450px"><!-- wp:surecart/store-logo /-->
	
	<!-- wp:group {"style":{"spacing":{"padding":{"bottom":"var:preset|spacing|40"}}},"layout":{"inherit":true,"type":"constrained"}} -->
	<div class="wp-block-group" style="padding-bottom:var(--wp--preset--spacing--40)"><!-- wp:surecart/heading {"title":"Complete your payment","description":"Please provide your contact details and payment information"} -->
	<sc-heading>Complete your payment<span slot="description">Please provide your contact details and payment information</span><span slot="end"></span></sc-heading>
	<!-- /wp:surecart/heading --></div>
	<!-- /wp:group -->
	
	<!-- wp:surecart/name -->
	<sc-customer-name label="Name" required class="wp-block-surecart-name"></sc-customer-name>
	<!-- /wp:surecart/name -->
	
	<!-- wp:surecart/email /-->
	
	<!-- wp:surecart/express-payment -->
	<sc-express-payment divider-text="or" class="wp-block-surecart-express-payment"></sc-express-payment>
	<!-- /wp:surecart/express-payment -->
	
	<!-- wp:surecart/checkout-errors -->
	<sc-checkout-form-errors></sc-checkout-form-errors>
	<!-- /wp:surecart/checkout-errors -->
	
	<!-- wp:surecart/payment {"secure_notice":"This is a secure, encrypted payment"} -->
	<sc-payment label="Payment" secure-notice="This is a secure, encrypted payment" class="wp-block-surecart-payment"></sc-payment>
	<!-- /wp:surecart/payment -->
	
	<!-- wp:group {"style":{"spacing":{"padding":{"top":"var:preset|spacing|60"}}},"layout":{"inherit":true,"type":"constrained"}} -->
	<div class="wp-block-group" style="padding-top:var(--wp--preset--spacing--60)"><!-- wp:surecart/submit {"show_total":true,"full":true} -->
	<sc-order-submit type="primary" full="true" size="large" icon="lock" show-total="true" class="wp-block-surecart-submit">Purchase</sc-order-submit>
	<!-- /wp:surecart/submit --></div>
	<!-- /wp:group --></sc-column>
	<!-- /wp:surecart/column -->
	
	<!-- wp:surecart/column {"width":"","backgroundColor":"ast-global-color-4","style":{"border":{"left":{"color":"var:preset|color|ast-global-color-6"}},"spacing":{"padding":{"top":"var:preset|spacing|80","right":"var:preset|spacing|60","bottom":"var:preset|spacing|80","left":"var:preset|spacing|60"}}},"layout":{"type":"constrained","contentSize":"450px","justifyContent":"left"}} -->
	<sc-column class="wp-block-surecart-column is-layout-constrained is-horizontally-aligned-left has-ast-global-color-4-background-color has-background" style="border-left-color:var(--wp--preset--color--ast-global-color-6);padding-top:var(--wp--preset--spacing--80);padding-right:var(--wp--preset--spacing--60);padding-bottom:var(--wp--preset--spacing--80);padding-left:var(--wp--preset--spacing--60);--sc-column-content-width:450px"><!-- wp:surecart/totals {"collapsible":true,"collapsedOnMobile":true} -->
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
