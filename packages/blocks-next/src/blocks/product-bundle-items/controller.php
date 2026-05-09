<?php
/**
 * Product Bundle Items — outer container that renders on a bundle product's
 * detail page. Iterates the product's BundleItems via the inner template.
 *
 * Bundle is a Product attribute post-refactor (was on Price). Each BundleItem
 * exposes its component via `component_product`. Variant choice is the
 * shopper's at checkout — it's not on the bundle item.
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
