<?php
$product_id = isset( $_GET['product-quick-view'] ) ? (int) $_GET['product-quick-view'] : null;
$close_url  = remove_query_arg( 'product-quick-view' );
$query      = new WP_Query( [
	'post__in'  => ! empty( $product_id ) ? [ $product_id ] : [ 0 ], // Ensures no posts are found if null.
	'post_type' => 'sc_product',
] );

// Set the interactivity state for the quick view.
wp_interactivity_state(
	'surecart/product-quick-view',
	array(
		'open' => $query->have_posts(),
	)
);

// We need to enqueue these assets as we do not know if the quick view item will need lightbox or slider functionality.
wp_enqueue_style( 'surecart-lightbox' );
wp_enqueue_script_module( 'surecart/lightbox' );
wp_enqueue_style( 'surecart-image-slider' );
wp_enqueue_script_module( '@surecart/image-slider' );

return 'file:./view.php';
