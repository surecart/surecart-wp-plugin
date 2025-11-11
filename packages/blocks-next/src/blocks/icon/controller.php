<?php
$icon_name    = $attributes['icon_name'] ?? 'star';
$size         = $attributes['size'] ?? 24;
$width        = $attributes['width'] ?? '';
$height       = $attributes['height'] ?? '';
$stroke_width = $attributes['stroke_width'] ?? 2;
$alignment    = $attributes['alignment'] ?? '';
$link_url     = $attributes['link_url'] ?? '';
$link_target  = $attributes['link_target'] ?? '_self';
$link_rel     = $attributes['link_rel'] ?? '';

// Build inline styles.
$icon_styles = [];
if ( ! empty( $width ) ) {
	$icon_styles[] = 'width: ' . esc_attr( $width );
} else {
	$icon_styles[] = 'width: ' . esc_attr( $size ) . 'px';
}

if ( ! empty( $height ) ) {
	$icon_styles[] = 'height: ' . esc_attr( $height );
} else {
	$icon_styles[] = 'height: ' . esc_attr( $size ) . 'px';
}

$icon_styles[] = 'display: inline-block';

$icon_style_attr = implode( '; ', $icon_styles );

// Build wrapper styles.
$wrapper_styles = [];
if ( ! empty( $alignment ) ) {
	$wrapper_styles[] = 'text-align: ' . esc_attr( $alignment );
}

$wrapper_style_attr = ! empty( $wrapper_styles ) ? implode( '; ', $wrapper_styles ) : '';

// Get block wrapper attributes.
$wrapper_attributes = get_block_wrapper_attributes(
	[
		'class' => 'wp-block-surecart-icon',
		'style' => $wrapper_style_attr,
	]
);

// Get the SVG icon.
$icon_svg = SureCart::svg()->get(
	$icon_name,
	[
		'stroke-width' => esc_attr( $stroke_width ),
		'class'        => 'surecart-icon',
	]
);

// Return the view.
return 'file:./view.php';
