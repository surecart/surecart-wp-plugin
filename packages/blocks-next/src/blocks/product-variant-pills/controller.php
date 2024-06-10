<?php
/**
 * PHP controller to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 */

// get initial state.
$products = wp_interactivity_state( 'surecart/product' );

// get product from initial state.
$product = get_query_var( 'surecart_current_product' );

// make sure we have a product and variant options.
if ( empty( $product->id ) || empty( $product->variant_options->data ) ) {
	return;
}

// return the view.
return 'file:./view.php';
