<?php
$icon            = $attributes['icon'] ?? 'eye';
$product_id      = $block->context['postId'] ?? null;
$quick_view_link = add_query_arg( 'product-quick-view', $product_id);
$show_icon       = 'icon' === $attributes['quickViewButtonType'] || 'both' === $attributes['quickViewButtonType'];
$show_text       = 'text' === $attributes['quickViewButtonType'] || 'both' === $attributes['quickViewButtonType'];
$icon_position   = $attributes['iconPosition'] ?? 'after';
$label           = $attributes['label'] ?? __( 'Quick View', 'surecart' );
$gap             = ! empty( $attributes['style']['spacing']['blockGap'] ) ? \SureCart::block()->styles()->getBlockGapPresetCssVar( $attributes['style']['spacing']['blockGap'] ) : '';
$alignment       = ! empty( $attributes['style']['typography']['textAlign'] ) ? $attributes['style']['typography']['textAlign'] : '';
$width_class     = ! empty( $attributes['width'] ) ? 'has-custom-width wp-block-button__width-' . $attributes['width'] : '';

$style = ! empty( $gap )
	? esc_attr( safecss_filter_attr( 'gap:' . $gap ) ) . ';'
	: '';

if ( ! empty( $alignment ) ) {
	$style .= 'justify-content:' . esc_attr( $alignment ) . ';';
}

return 'file:./view.php';
