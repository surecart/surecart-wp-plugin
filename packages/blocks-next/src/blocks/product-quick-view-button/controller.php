<?php
$icon            = $attributes['icon'] ?? 'eye';
$product_id      = $block->context['postId'] ?? null;
$url             = \SureCart::block()->urlParams( 'product-quick-view' );
$quick_view_link = $url->addProductQuickViewArg( $product_id )->url();
$show_icon       = 'icon' === $attributes['quickViewButtonType'] || 'both' === $attributes['quickViewButtonType'];
$show_text       = 'text' === $attributes['quickViewButtonType'] || 'both' === $attributes['quickViewButtonType'];
$label           = $attributes['label'] ?? __( 'Quick View', 'surecart' );
$gap             = ! empty( $attributes['style']['spacing']['blockGap'] ) ? \SureCart::block()->styles()->getBlockGapPresetCssVar( $attributes['style']['spacing']['blockGap'] ) : '';

$style = ! empty( $gap )
	? esc_attr( safecss_filter_attr( 'gap:' . $gap ) ) . ';'
	: '';

// We need to enqueue these assets as the quick view dialog is rendered in the footer.
wp_enqueue_style( 'surecart-lightbox' );
wp_enqueue_script_module( 'surecart/lightbox' );
wp_enqueue_style( 'surecart-image-slider' );
wp_enqueue_script_module( '@surecart/image-slider' );

return 'file:./view.php';
