<?php
$style = '';
$style .= ! empty( $attributes['border'] )
	? esc_attr( safecss_filter_attr( 'border' . $attributes['border'] ) ) . ';'
	: '';
$style .= ! empty( $attributes['padding'] )
	? esc_attr( safecss_filter_attr( 'padding:' . $attributes['padding'] ) ) . ';'
	: '';
$style .= ! empty( $attributes['backgroundColor'] )
	? esc_attr( safecss_filter_attr( 'background-color:' . $attributes['backgroundColor'] ) ) . ';'
	: '';
$style .= ! empty( $attributes['textColor'] )
    ? esc_attr( safecss_filter_attr( 'color:' . $attributes['textColor'] ) ) . ';'
    : '';

return 'file:./view.php';