<?php
$product = sc_get_product();

// handle the width attribute.
if ( ! empty( $attributes['width'] ) ) {
	$width_class = 'has-custom-width wp-block-button__width-' . $attributes['width'];
}

$styles = sc_get_block_styles();

$add_to_cart = $attributes['add_to_cart'] ?? true;
if ( ! \SureCart::cart()->isCartEnabled() ) {
	$add_to_cart = false;
}

// Enqueue the sticky purchase module script if needed.
if ( isset( $attributes['show_sticky_purchase_button'] ) && $attributes['show_sticky_purchase_button'] ) {
	wp_enqueue_script_module( '@surecart/sticky-purchase' );
}

// return the view.
return 'file:./view.php';
