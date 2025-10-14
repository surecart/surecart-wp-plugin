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

// Ensure attributes exist and provide sensible defaults.
$attributes['icon_color'] = $attributes['icon_color'] ?? '';
$attributes['icon_size']  = $attributes['icon_size'] ?? 20;
$attributes['show_label'] = $attributes['show_label'] ?? true;
$attributes['label']      = $attributes['label'] ?? '';

return 'file:./view.php';
