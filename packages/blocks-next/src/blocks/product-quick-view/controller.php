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

$styles = sc_get_block_styles( false );
$style  = $styles['color']['css'] ?? '';

if ( ! empty( $attributes['height'] ) ) {
	$style .= 'height:' . $attributes['height'] . ';';
}
if ( ! empty( $attributes['width'] ) ) {
	$style .= 'max-width:' . $attributes['width'] . ';';
}

$content_style = '';

if ( ! empty( $styles['spacing']['declarations'] ) ) {
	$declarations = $styles['spacing']['declarations'];

	$style .= ! empty( $declarations['margin-top'] ) ? esc_attr( safecss_filter_attr( 'margin-top:' . $declarations['margin-top'] ) ) . ';' : '';
	$style .= ! empty( $declarations['margin-bottom'] ) ? esc_attr( safecss_filter_attr( 'margin-bottom:' . $declarations['margin-bottom'] ) ) . ';' : '';
	$style .= ! empty( $declarations['margin-left'] ) ? esc_attr( safecss_filter_attr( 'margin-left:' . $declarations['margin-left'] ) ) . ';' : '';
	$style .= ! empty( $declarations['margin-right'] ) ? esc_attr( safecss_filter_attr( 'margin-right:' . $declarations['margin-right'] ) ) . ';' : '';

	$content_style .= ! empty( $declarations['padding-top'] ) ? esc_attr( safecss_filter_attr( 'padding-top:' . $declarations['padding-top'] ) ) . ';' : '';
	$content_style .= ! empty( $declarations['padding-bottom'] ) ? esc_attr( safecss_filter_attr( 'padding-bottom:' . $declarations['padding-bottom'] ) ) . ';' : '';
	$content_style .= ! empty( $declarations['padding-left'] ) ? esc_attr( safecss_filter_attr( 'padding-left:' . $declarations['padding-left'] ) ) . ';' : '';
	$content_style .= ! empty( $declarations['padding-right'] ) ? esc_attr( safecss_filter_attr( 'padding-right:' . $declarations['padding-right'] ) ) . ';' : '';
}

// Set the interactivity state for the quick view.
wp_interactivity_state(
	'surecart/product-quick-view',
	array(
		'open' => $query->have_posts(),
	)
);

return 'file:./view.php';
