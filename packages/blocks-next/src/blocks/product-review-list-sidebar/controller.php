<?php
use SureCart\Models\Blocks\ProductReviewListBlock;

$product = sc_get_product();
if ( ! $product || empty( $product->total_reviews ) ) {
	return '';
}

$controller = new ProductReviewListBlock( $block );

// Set the initial state used in SSR.
wp_interactivity_state(
	'surecart/sidebar',
	[
		'open' => $attributes['open'] ?? true,
	]
);

// return the view.
return 'file:./view.php';
