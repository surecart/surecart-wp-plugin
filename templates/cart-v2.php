<?php
/**
 * Cart page block template.
 */
return [
	'title'      => __( 'Cart', 'surecart' ),
	'categories' => [],
	'blockTypes' => [],
	'content'    => '<!-- wp:surecart/cart-v2 {"lock":{"move":true,"remove":true}} -->
	<!-- wp:surecart/cart-header-v2 {"text":"Review Your Cart v2","padding":{"top":"1.25em","right":"1.25em","bottom":"1.25em","left":"1.25em"},"lock":{"move":false,"remove":true}} -->
	<div style="border-bottom:var(--sc-drawer-border);padding-top:1.25em;padding-bottom:1.25em;padding-left:1.25em;padding-right:1.25em"><sc-cart-header><span>My Cart</span></sc-cart-header></div>
	<!-- /wp:surecart/cart-header-v2 -->

	<!-- wp:surecart/cart-items-v2 {"border":true,"lock":{"move":false,"remove":true}} -->
	<sc-line-items style="border-bottom:var(--sc-drawer-border);padding-top:1.25em;padding-bottom:1.25em;padding-left:1.25em;padding-right:1.25em" removable="true" editable="true"></sc-line-items>
	<!-- /wp:surecart/cart-items-v2 -->

	<!-- wp:surecart/cart-coupon-v2 -->
	<sc-order-coupon-form style="border-bottom:var(--sc-drawer-border);padding-top:1.25em;padding-bottom:1.25em;padding-left:1.25em;padding-right:1.25em" label="Add Coupon Code">Apply Coupon</sc-order-coupon-form>
	<!-- /wp:surecart/cart-coupon-v2 -->

	<!-- wp:surecart/cart-subtotal-v2 {"border":false,"padding":{"top":"1.25em","right":"1.25em","bottom":"0em","left":"1.25em"}} /-->

	<!-- wp:surecart/cart-bump-line-item-v2 {"border":false,"padding":{"top":"1.25em","left":"1.25em","bottom":"0em","right":"1.25em"}} /-->

	<!-- wp:surecart/cart-submit-v2 {"show_icon":true,"border":true,"lock":{"move":false,"remove":true}} -->
	<sc-cart-submit style="border-bottom:var(--sc-drawer-border);padding-top:1.25em;padding-bottom:1.25em;padding-left:1.25em;padding-right:1.25em" type="primary" size="medium" icon="lock">Checkout</sc-cart-submit>
	<!-- /wp:surecart/cart-submit-v2 -->
	<!-- /wp:surecart/cart-v2 -->',
];
