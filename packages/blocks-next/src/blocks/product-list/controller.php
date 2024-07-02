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

$block_id = $block->context['surecart/product-list/block_id'] ?? '';

// For Analytics.
$controller = new ProductListBlock( $block );
$query      = $controller->query();
$products   = $query->products;

// return the view.
return 'file:./view.php';
