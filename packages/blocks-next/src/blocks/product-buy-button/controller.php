<?php
$product = sc_get_product();

// handle the width attribute.
if ( ! empty( $attributes['width'] ) ) {
	$width_class = 'has-custom-width wp-block-button__width-' . $attributes['width'];
}

$styles = sc_get_block_styles();

// return the view.
return 'file:./view.php';
