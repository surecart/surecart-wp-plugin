<?php
/**
 * Outer container for the bundle items list on a bundle product page.
 */
$product = sc_get_product();

if ( empty( $product ) || empty( $product->bundle ) ) {
	return '';
}

$bundle_items = $product->bundle_items->data ?? array();
if ( empty( $bundle_items ) ) {
	return '';
}

return 'file:./view.php';
