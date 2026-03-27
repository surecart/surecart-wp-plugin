<?php

$styles = sc_get_block_styles();
$class  = $attributes['sizing'] ? 'contain' === $attributes['sizing'] ? 'sc-is-contained ' : 'sc-is-covered ' : 'sc-is-covered ';

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

$style .= $styles['css'] ?? '';
$class .= $styles['classnames'] ?? '';

return 'file:./view.php';
