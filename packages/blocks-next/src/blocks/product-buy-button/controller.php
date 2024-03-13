<?php
$styles = sc_get_block_styles();
$style = $styles['css'] ?? '';
$class = $styles['classnames'] ?? '';

// handle the width attribute.
if (  ! empty( $attributes['width'] ) ) {
	$class .= ' ' . 'has-custom-width sc-button__width-' . $attributes['width'];
}

// return the view.
return 'file:./view.php';
