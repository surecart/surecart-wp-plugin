<?php
$product = sc_get_product();

// make sure we have the product.
if ( empty( $product ) ) {
	return null;
}

$class  = 'align-left '; // For theme compatibility.
$class .= $attributes['sizing'] ? ( 'contain' === $attributes['sizing'] ? 'sc-is-contained' : 'sc-is-covered' ) : 'sc-is-covered';

$style  = '';
$style .= ! empty( $attributes['aspectRatio'] )
	? esc_attr( safecss_filter_attr( 'aspect-ratio:' . $attributes['aspectRatio'] ) ) . ';'
	: '';
$style .= ! empty( $attributes['width'] )
	? esc_attr( safecss_filter_attr( 'width:' . $attributes['width'] ) ) . ';'
	: '';
$style .= ! empty( $attributes['height'] )
	? esc_attr( safecss_filter_attr( 'height:' . $attributes['height'] ) ) . ';'
	: '';

return 'file:./view.php';
