<?php
$icon            = $attributes['icon'] ?? 'plus';
$product_id      = $block->context['postId'] ?? null;
$quick_view_link = add_query_arg( 'product-quick-view', $product_id );
$show_icon       = 'icon' === $attributes['quickViewButtonType'] || 'both' === $attributes['quickViewButtonType'];
$show_text       = 'text' === $attributes['quickViewButtonType'] || 'both' === $attributes['quickViewButtonType'];
$icon_position   = $attributes['iconPosition'] ?? 'after';
$label           = $attributes['label'] ?? __( 'Quick Add', 'surecart' );
$gap             = ! empty( $attributes['style']['spacing']['blockGap'] ) ? \SureCart::block()->styles()->getBlockGapPresetCssVar( $attributes['style']['spacing']['blockGap'] ) : '';
$alignment       = ! empty( $attributes['style']['typography']['textAlign'] ) ? $attributes['style']['typography']['textAlign'] : '';
$width_class     = ! empty( $attributes['width'] ) ? 'has-custom-width wp-block-button__width-' . $attributes['width'] : '';

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

return 'file:./view.php';
