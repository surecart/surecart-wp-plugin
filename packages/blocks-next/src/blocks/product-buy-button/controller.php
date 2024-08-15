<?php
$product = sc_get_product();

// handle the width attribute.
if ( ! empty( $attributes['width'] ) ) {
	$width_class = 'has-custom-width wp-block-button__width-' . $attributes['width'];
}

if ( ! empty( $attributes['className'] ) ) {
	$custom_class = 'has_custom_class';
}

// return the view.
return 'file:./view.php';
