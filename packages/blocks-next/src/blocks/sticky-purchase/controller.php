<?php
$product = sc_get_product();

// Get block attributes.
$width = isset( $attributes['width'] ) ? esc_attr( $attributes['width'] ) : '600px';

// Create inline style for CSS variables.
$style = sprintf(
	'--sc-sticky-purchase-width: %s;',
	$width
);

// Set the interactivity state for the sticky purchase block.
wp_interactivity_state( 'surecart/sticky-purchase' );

// Get the buy button block template and settings.
$template_id = wp_is_block_theme() ? 'surecart/surecart//single-sc_product' : 'surecart/surecart//product-info';
$template    = get_block_template( $template_id, wp_is_block_theme() ? 'wp_template' : 'wp_template_part' );
if ( empty( $template->content ) ) {
	return '';
}

$blocks = parse_blocks( $template->content );
if ( empty( $blocks ) ) {
	return '';
}

$buy_button_block = sc_find_block( 'surecart/product-buy-button', $blocks );
if ( ! $buy_button_block ) {
	return '';
}

$buy_button_args     = $buy_button_block['attrs'] ?? [];
$enable_out_of_stock = $buy_button_args['show_sticky_purchase_on_out_of_stock'] ?? false;

return 'file:./view.php';
