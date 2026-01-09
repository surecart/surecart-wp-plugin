<?php
$product_id     = isset( $_GET['product-review-form'] ) ? absint( $_GET['product-review-form'] ) : null;
$has_product_id = ! empty( $product_id );

// Only fetch product if we have an ID (for server-side rendering when opened via URL).
$product       = sc_get_product( $product_id );
$sc_product_id = $product ? $product->id : '';

$close_url      = $has_product_id ? get_permalink( $product_id ) : '';
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

// Set the interactivity state for the review form.
wp_interactivity_state(
	'surecart/product-review-form',
	array(
		'open' => $has_product_id,
	)
);

// Parse inner blocks to separate form and confirmation sections.
$form_content         = '';
$confirmation_content = '';

if ( ! empty( $block->inner_blocks ) ) {
	foreach ( $block->inner_blocks as $inner_block ) {
		$block_name = $inner_block->parsed_block['blockName'] ?? '';

		// Check if this is the form wrapper block.
		if ( 'surecart/product-review-form-wrapper' === $block_name ) {
			$form_content .= render_block( $inner_block );
		} elseif ( 'surecart/product-review-confirmation-wrapper' === $block_name ) {
			// Check if this is the confirmation wrapper block.
			$confirmation_content .= render_block( $inner_block );
		} else {
			// If no specific wrapper, add to form content by default.
			$form_content .= render_block( $inner_block );
		}
	}
}

return 'file:./view.php';
