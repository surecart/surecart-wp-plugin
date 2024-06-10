<?php
/**
 * PHP controller to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 */

// get product from initial state.
$product = sc_get_product();

// make sure we have a product.
if ( empty( $product->id ) ) {
	return '';
}

// get only active prices.
$prices = $product->active_prices;
if ( empty( $prices ) || count( $prices ) < 2 ) {
	return '';
}

// return the view.
return 'file:./view.php';
