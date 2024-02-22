<?php
// Generate unique id for aria-controls.
$unique_id = wp_unique_id( 'p-' );

// TODO: In the future, we can just get the context passed from the wrapper block.
// get product page id.
$product_id = get_query_var( 'sc_product_page_id' ) ?? $attributes['productId'] ?? null;
// if no product id, return.
if ( empty( $product_id ) ) {
	return;
}
// get initial state.
$products = wp_interactivity_state( 'surecart/product' );
// get product from initial state.
$product = $products[ $product_id ]['product'] ?? null;

// get all the block styles.
$raw_styles = sc_get_block_styles();
var_dump($raw_styles);

$test = '--sc-pill-option-background-color: ' . $raw_styles['declarations']['background-color'];
// Or we can return a view file.
return 'file:./view.php';
