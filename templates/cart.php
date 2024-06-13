<?php
/**
 * Cart page block template.
 */
return [
	'title'      => __( 'Cart', 'surecart' ),
	'categories' => [],
	'blockTypes' => [],
	'content'    => '<!-- wp:surecart/cart-v2 {"layout":{"type":"default"}} -->
<!-- wp:surecart/cart-header-v2 {"text":"Review Your Cart"} /-->

<!-- wp:surecart/cart-items-v2 /-->

<!-- wp:surecart/cart-coupon-v2 /-->

<!-- wp:surecart/cart-subtotal-v2 /-->

<!-- wp:surecart/cart-bump-line-item-v2 /-->

<!-- wp:surecart/cart-submit-v2 /-->
<!-- /wp:surecart/cart-v2 -->',
];
