<?php
$url         = \SureCart::block()->urlParams( 'product-quick-view' );
$show_footer = $attributes['showViewProductPageStickyFooter'] ?? true;
$product_id  = $url->getProductQuickViewArg();
$args        = [
	'post__in'  => ! empty( $product_id ) ? [ $product_id ] : [ 0 ], // Ensures no posts are found if null.
	'post_type' => 'sc_product',
];
$query      = new WP_Query( $args );
$close_url  = $url->removeProductQuickViewArg();

// Set the interactivity state for the quick view.
wp_interactivity_state(
	'@surecart/product-quick-view',
	array(
		'open'                 => false,
		'showClosingAnimation' => false,
	)
);

return 'file:./view.php';
