<?php
$product_id     = isset( $_GET['product-quick-view'] ) ? (int) $_GET['product-quick-view'] : null;
$query          = new WP_Query(
	[
		'post__in'  => ! empty( $product_id ) ? [ $product_id ] : [ 0 ], // Ensures no posts are found if null.
		'post_type' => 'sc_product',
	]
);
$close_url      = remove_query_arg( 'product-quick-view' );
$position_class = $attributes['alignment'] ? 'position-' . str_replace( ' ', '-', $attributes['alignment'] ) : '';

$styles = sc_get_block_styles();
$style  = $styles['css'] ?? '';

if ( ! empty( $attributes['height'] ) ) {
	$style .= 'height:' . $attributes['height'] . ';';
}
if ( ! empty( $attributes['width'] ) ) {
	$style .= 'max-width:' . $attributes['width'] . ';';
}

// Set the interactivity state for the quick view.
wp_interactivity_state(
	'surecart/product-quick-view',
	array(
		'open' => $query->have_posts(),
	)
);

return 'file:./view.php';
