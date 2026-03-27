<?php

$styles = sc_get_block_styles();

$wrapper_style = '';

if ( ! empty( $styles['declarations'] ) ) {
	$wrapper_style .= isset( $styles['declarations']['margin-top'] )
		? esc_attr( safecss_filter_attr( 'margin-top:' . $styles['declarations']['margin-top'] ) ) . ';'
		: '';
	$wrapper_style .= isset( $styles['declarations']['margin-bottom'] )
		? esc_attr( safecss_filter_attr( 'margin-bottom:' . $styles['declarations']['margin-bottom'] ) ) . ';'
		: '';
}

// Return the view.
return 'file:./view.php';
