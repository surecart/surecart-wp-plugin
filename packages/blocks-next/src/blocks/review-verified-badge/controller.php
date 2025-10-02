<?php

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
