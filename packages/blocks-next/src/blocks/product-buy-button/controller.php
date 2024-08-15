<?php
$styles = sc_get_block_styles();
$style  = $styles['css'] ?? '';
$class  = ( $styles['classnames'] ?? '' ) . ' ' . ( $attributes['buttonClassName'] ?? '' ) . ' ';
error_log( $class );

$product = sc_get_product();

// handle the width attribute.
if ( ! empty( $attributes['width'] ) ) {
	$width_class = 'has-custom-width wp-block-button__width-' . $attributes['width'];
	$class      .= $width_class;
}

// return the view.
return 'file:./view.php';
