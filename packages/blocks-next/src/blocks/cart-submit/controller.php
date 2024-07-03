<?php
$style  = '';
$style .= ! empty( $attributes['border'] )
	? esc_attr( safecss_filter_attr( 'border-bottom: var(--sc-drawer-border);' ) )
	: '';
$style .= ! empty( $attributes['padding'] )
	? esc_attr( safecss_filter_attr( 'padding:' . $attributes['padding']['top'] . ' ' . $attributes['padding']['right'] . ' ' . $attributes['padding']['bottom'] . ' ' . $attributes['padding']['left'] ) ) . ';'
	: '';
$style .= ! empty( $attributes['sectionBackgroundColor'] )
	? esc_attr( safecss_filter_attr( 'background-color:' . $attributes['sectionBackgroundColor'] ) ) . ';'
	: '';
$style .= ! empty( $attributes['textColor'] )
	? esc_attr( safecss_filter_attr( 'color:' . $attributes['textColor'] ) ) . ';'
	: '';

// Return the view.
return 'file:./view.php';
