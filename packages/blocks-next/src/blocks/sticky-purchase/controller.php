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

return 'file:./view.php';
