<?php
// Generate unique id for aria-controls.
$unique_id = wp_unique_id( 'p-' );
// TODO: In the future, we can just get the context passed from the wrapper block.
// get product page id.
$product_id = get_query_var( 'sc_product_page_id' ) ?? $attributes['productId'] ?? null;
// get initial state.
$products = wp_interactivity_state( 'surecart/product' );
// get product from initial state.
$product = $products[ $product_id ]['product'] ?? null;
// return the view we want.
return 'file:./view.php';
