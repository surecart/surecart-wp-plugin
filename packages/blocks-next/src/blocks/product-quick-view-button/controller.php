<?php
$icon                   = $attributes['icon'] ?? 'plus';
$product_id             = $block->context['postId'] ?? null;
$show_icon              = in_array( $attributes['quick_view_button_type'], [ 'icon', 'both' ], true );
$show_text              = in_array( $attributes['quick_view_button_type'], [ 'text', 'both' ], true );
$icon_position          = $attributes['icon_position'] ?? 'before';
$label                  = $attributes['label'] ?? __( 'Quick Add', 'surecart' );
$direct_add_to_cart     = $attributes['direct_add_to_cart'] ?? true;
$quick_view_link        = add_query_arg( 'product-quick-view', $product_id );
$gap                    = ! empty( $attributes['style']['spacing']['blockGap'] ) ? \SureCart::block()->styles()->getBlockGapPresetCssVar( $attributes['style']['spacing']['blockGap'] ) : '';
$alignment              = ! empty( $attributes['style']['typography']['textAlign'] ) ? $attributes['style']['typography']['textAlign'] : '';
$width_class            = ! empty( $attributes['width'] ) ? 'has-custom-width wp-block-button__width-' . $attributes['width'] : '';
$show_loading_indicator = $attributes['show_loading_indicator'] ?? false;

$style = ! empty( $gap )
	? esc_attr( safecss_filter_attr( 'gap:' . $gap ) ) . ';'
	: '';

if ( ! empty( $alignment ) ) {
	$style .= 'justify-content:' . esc_attr( $alignment ) . ';';
}

$styles = sc_get_block_styles();

$wrapper_style = '';

if ( ! empty( $styles['declarations'] ) ) {
	$wrapper_style .= ! empty( $styles['declarations']['margin-top'] ) ? esc_attr( safecss_filter_attr( 'margin-top:' . $styles['declarations']['margin-top'] ) ) . ';' : '';
	$wrapper_style .= ! empty( $styles['declarations']['margin-bottom'] ) ? esc_attr( safecss_filter_attr( 'margin-bottom:' . $styles['declarations']['margin-bottom'] ) ) . ';' : '';
	$wrapper_style .= ! empty( $styles['declarations']['margin-left'] ) ? esc_attr( safecss_filter_attr( 'margin-left:' . $styles['declarations']['margin-left'] ) ) . ';' : '';
	$wrapper_style .= ! empty( $styles['declarations']['margin-right'] ) ? esc_attr( safecss_filter_attr( 'margin-right:' . $styles['declarations']['margin-right'] ) ) . ';' : '';
}

// Determine if we should add directly to cart.
$product           = sc_get_product();
$should_direct_add = $direct_add_to_cart && empty( $product->has_options );

return $should_direct_add ? 'file:./button-cart.php' : 'file:./button-quick-view.php';
