<?php
/**
 * Get the allowed SVG for safe output.
 *
 * @return array
 */
function sc_allowed_svg_html(): array {
	$kses_defaults = wp_kses_allowed_html( 'post' );

	/**
	 * Filters the allowed SVG attributes.
	 *
	 * @param array $svg_args An array of allowed SVG attributes.
	 */
	$svg_args = apply_filters(
		'sc_allowed_svg_html',
		array(
			'svg'            => array(
				'class'             => true,
				'aria-hidden'       => true,
				'aria-labelledby'   => true,
				'role'              => true,
				'xmlns'             => true,
				'width'             => true,
				'height'            => true,
				'viewbox'           => true,
				'fill'              => true,
				'color'             => true,
				'fill-rule'         => true,
				'fill-opacity'      => true,
				'stroke'            => true,
				'stroke-width'      => true,
				'stroke-linecap'    => true,
				'stroke-linejoin'   => true,
				'stroke-miterlimit' => true,
			),
			'defs'           => array( 'id' => true ),
			'clipPath'       => array( 'id' => true ),
			'clippath'       => array( 'id' => true ),
			'linearGradient' => array( 'id' => true ),
			'lineargradient' => array( 'id' => true ),
			'stop'           => array(
				'offset'       => true,
				'stop-color'   => true,
				'stopOpacity'  => true,
				'stop-opacity' => true,
			),
			'g'              => array(
				'fill'      => true,
				'transform' => true,
				'clip-path' => true,
			),
			'title'          => array( 'title' => true ),
			'path'           => array(
				'd'                 => true,
				'fill'              => true,
				'stroke'            => true,
				'stroke-linecap'    => true,
				'stroke-linejoin'   => true,
				'stroke-miterlimit' => true,
				'transform'         => true,
				'clip-path'         => true,
				'fill-rule'         => true,
				'clip-rule'         => true,
			),
			'circle'         => array(
				'stroke'            => true,
				'stroke-linecap'    => true,
				'stroke-linejoin'   => true,
				'stroke-miterlimit' => true,
				'cx'                => true,
				'cy'                => true,
				'r'                 => true,
				'fill'              => true,
			),
			'ellipse'        => array(
				'stroke'            => true,
				'stroke-linecap'    => true,
				'stroke-linejoin'   => true,
				'stroke-miterlimit' => true,
				'cx'                => true,
				'cy'                => true,
				'rx'                => true,
				'ry'                => true,
				'fill'              => true,
			),
			'line'           => array(
				'x1'                => true,
				'y1'                => true,
				'x2'                => true,
				'y2'                => true,
				'stroke'            => true,
				'stroke-linecap'    => true,
				'stroke-linejoin'   => true,
				'stroke-miterlimit' => true,
			),
			'polygon'        => array(
				'points'            => true,
				'fill'              => true,
				'stroke'            => true,
				'stroke-linecap'    => true,
				'stroke-linejoin'   => true,
				'stroke-miterlimit' => true,
				'clip-path'         => true,
			),
			'polyline'       => array(
				'points'            => true,
				'fill'              => true,
				'stroke'            => true,
				'stroke-linecap'    => true,
				'stroke-linejoin'   => true,
				'stroke-miterlimit' => true,
			),
			'rect'           => array(
				'x'                 => true,
				'y'                 => true,
				'width'             => true,
				'height'            => true,
				'fill'              => true,
				'stroke'            => true,
				'stroke-linecap'    => true,
				'stroke-linejoin'   => true,
				'stroke-miterlimit' => true,
			),
			'text'           => array(
				'x'                 => true,
				'y'                 => true,
				'dx'                => true,
				'dy'                => true,
				'font-size'         => true,
				'fill'              => true,
				'stroke'            => true,
				'stroke-linecap'    => true,
				'stroke-linejoin'   => true,
				'stroke-miterlimit' => true,
			),
		)
	);

	return array_merge( $kses_defaults, $svg_args );
}

/**
 * Add sizes and srcset to allowed image HTML.
 *
 * @return array
 */
function sc_allowed_image_html(): array {
	$kses = wp_kses_allowed_html( 'post' );

	$kses['img']['srcset'] = true;
	$kses['img']['sizes']  = true;

	return $kses;
}
