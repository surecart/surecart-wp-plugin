<?php
// get product.

use SureCart\Models\Blocks\ProductPageBlock;

$product = sc_get_product();

// if no product id, return.
if ( empty( $product ) ) {
	return;
}

$controller = new ProductPageBlock( $block );
$state      = $controller->state();
$context    = $controller->context();

wp_interactivity_state( 'surecart/product-page', $state );

return 'file:./view.php';
