<?php

namespace SureCart\WordPress\Shortcodes;

/**
 * The shortcodes service.
 */
class ShortcodesService {
	/**
	 * Convert the block
	 *
	 * @param string $name Block name.
	 * @param string $block Block class.
	 * @param array  $defaults Default attributes.
	 *
	 * @return string
	 */
	public function registerBlockShortcode( $name, $class, $defaults = [] ) {
		add_shortcode(
			$name,
			function( $attributes, $content ) use ( $name, $class, $defaults ) {
				return ( new ShortcodesBlockConversionService( $attributes, $content ) )->convert(
					$name,
					$class,
					$defaults
				);
			},
			10,
			2
		);
	}
}
