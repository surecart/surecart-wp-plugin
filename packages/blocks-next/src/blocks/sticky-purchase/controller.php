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
$template_id      = wp_is_block_theme() ? 'surecart/surecart//single-sc_product' : 'surecart/surecart//product-info';
$template         = get_block_template( $template_id, wp_is_block_theme() ? 'wp_template' : 'wp_template_part' );
$buy_button_block = wp_get_first_block( parse_blocks( $template->content ?? '' ), 'surecart/product-buy-button' );
if ( ! $buy_button_block ) {
	return '';
}

global $sc_sticky_purchase_enable_out_of_stock;
$enable_out_of_stock = ( $buy_button_block['attrs'] ?? [] )['show_sticky_purchase_on_out_of_stock'] ?? false;

// Override if its coming from Elementor or other integrations.
if ( isset( $sc_sticky_purchase_enable_out_of_stock ) ) {
	$enable_out_of_stock = $sc_sticky_purchase_enable_out_of_stock;
}

return 'file:./view.php';
