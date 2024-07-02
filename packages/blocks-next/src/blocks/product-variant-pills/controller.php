<?php
$styles = sc_get_block_styles();
$style  = $styles['css'] ?? '';
$class  = $styles['classnames'] ?? '';

error_log( print_r( $styles, true ) );
error_log( print_r( $class, true ) );

// get product from initial state.
$product = sc_get_product();

// make sure we have a product and variant options.
if ( empty( $product->id ) || empty( $product->variant_options->data ) ) {
	return;
}

// return the view.
return 'file:./view.php';
