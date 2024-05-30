<?php
/**
 * Get the current block styles.
 *
 * @return array
 */
function sc_get_block_styles() {
	return \SureCart::block()->styles()->get();
}

/**
 * Get cart block style.
 *
 * @param  array $attributes
 *
 * @return string
 */
function sc_get_cart_block_style( $attributes ) {
	$style = '';

	// Border style.
	$style .= ! empty( $attributes['border'] ) ? 'border-bottom: var(--sc-drawer-border);' : '';

	// Padding style.
	$style .= ! empty( $attributes['padding']['top'] ) ? 'padding-top: ' . $attributes['padding']['top'] . ';' : '';
	$style .= ! empty( $attributes['padding']['bottom'] ) ? 'padding-bottom: ' . $attributes['padding']['bottom'] . ';' : '';
	$style .= ! empty( $attributes['padding']['left'] ) ? 'padding-left: ' . $attributes['padding']['left'] . ';' : '';
	$style .= ! empty( $attributes['padding']['right'] ) ? 'padding-right: ' . $attributes['padding']['right'] . ';' : '';

	// Background color style.
	$style .= ! empty( $attributes['backgroundColor'] ) ? 'background-color: ' . $attributes['backgroundColor'] . ';' : '';

	// Text color style.
	$style .= ! empty( $attributes['textColor'] ) ? 'color: ' . $attributes['textColor'] . ';' : '';

	return $style;
}
