<?php

if ( ! ( $block->context['show_value'] ?? true ) ) {
	return '';
}

$product = sc_get_product();
if ( ! $product ) {
	return '';
}

// Define and set styles.
$style_map = [
	'parentheses' => [
		'prefix' => '(',
		'suffix' => ')',
	],
	'brackets'    => [
		'prefix' => '[',
		'suffix' => ']',
	],
];

$style        = ! empty( $attributes['className'] ) ? str_replace( 'is-style-', '', $attributes['className'] ) : '';
$style_config = isset( $style_map[ $style ] ) ? $style_map[ $style ] : false;

$prefix = ! empty( $style_config['prefix'] ) ? $style_config['prefix'] : '';
$suffix = ! empty( $style_config['suffix'] ) ? $style_config['suffix'] : '';

return 'file:./view.php';
