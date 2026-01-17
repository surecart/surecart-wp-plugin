<?php

// If settings is enabled to hide the verified badge, don't render the block.
if ( get_option( 'surecart_hide_verified_buyer_badge', false ) ) {
	return;
}

// If no review in context, don't render the block.
if ( empty( $block->context['review'] ) ) {
	return;
}

// If review isn't verified, don't render the block.
if ( empty( $block->context['review']->verified ) ) {
	return;
}

$show_label  = $attributes['show_label'] ?? true;
$label       = $attributes['label'] ?? '';
$badge_label = ! empty( $label ) ? $label : __( 'Verified Buyer', 'surecart' );
$icon_size   = $attributes['icon_size'] ?? 16;

return 'file:./view.php';
