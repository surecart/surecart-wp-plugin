<?php

if ( ! ( $block->context['show_value'] ?? true ) ) {
	return '';
}

$product = sc_get_product();
if ( ! $product ) {
	return '';
}

$prefix = ! empty( $attributes['prefix'] ) ? $attributes['prefix'] : '';
$suffix = ! empty( $attributes['suffix'] ) ? $attributes['suffix'] : '';

return 'file:./view.php';
