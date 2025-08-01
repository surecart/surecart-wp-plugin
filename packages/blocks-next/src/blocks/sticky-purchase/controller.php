<?php
$product = sc_get_product();

// Get block attributes.
$width = isset( $attributes['width'] ) ? esc_attr( $attributes['width'] ) : '600px';

// Create inline style for CSS variables.
$style = sprintf(
	'--sc-sticky-purchase-width: %s;',
	$width
);

$show_sticky_purchase_button = $block->context['showStickyPurchaseButton'] ?? 'never';

return 'file:./view.php';
