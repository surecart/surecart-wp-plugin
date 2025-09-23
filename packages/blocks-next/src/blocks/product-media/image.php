<?php
\SureCart::render(
	'media/image',
	[
		'media'    => $media,
		'lightbox' => $attributes['lightbox'],
		'style'    => ( ! empty( $width ) ? 'max-width : min(' . esc_attr( $width ) . ', 100%);' : '' ) . ';' . ( ! $auto_height && ! empty( $attributes['height'] ) ? "height: {$attributes['height']}" : '' ),
		'loading'  => $loading ?? 'eager',
	]
);
