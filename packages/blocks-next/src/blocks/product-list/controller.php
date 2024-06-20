<?php
use SureCart\Models\Blocks\ProductListBlock;

// Set the intitial state used in SSR.
wp_interactivity_state(
	'surecart/product-list',
	[
		'loading'   => false,
		'searching' => false,
	]
);

$block_id = (int) $block->context['surecart/product-list/block_id'] ?? '';

// For Analytics.
$controller = new ProductListBlock( $block );
$query      = $controller->query();
$products = array_map( function($product) {
	return get_post_meta($product->ID, 'product', true) ?? '';
}, $list_query->posts);

// return the view.
return 'file:./view.php';
