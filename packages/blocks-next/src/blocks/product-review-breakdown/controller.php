<?php

$product = sc_get_product();

if ( ! $product ) {
	return;
}

$total   = (int) $product->total_reviews;
$columns = $attributes['columns'] ?? null;

$style_vars = array_filter(
	[
		'--sc-row-gap'                   => $attributes['row_gap'] ?? null,
		'--sc-column-gap'                => $attributes['column_gap'] ?? null,
		'--sc-star-fill-color'           => $attributes['fill_color'] ?? null,
		'--sc-star-stroke-color'         => $attributes['fill_color'] ?? null,
		'--sc-star-size'                 => $attributes['size'] ?? null,
		'--sc-star-bar-background-color' => $attributes['bar_background_color'] ?? null,
		'--sc-star-bar-fill-color'       => $attributes['bar_fill_color'] ?? null,
	]
);

$style = implode(
	' ',
	array_map(
		function ( $property, $value ) {
			return esc_attr( $property ) . ': ' . esc_attr( $value ) . ';';
		},
		array_keys( $style_vars ),
		$style_vars
	)
);

return 'file:./view.php';
