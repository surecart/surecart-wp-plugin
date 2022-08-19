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
				$service = new ShortcodesBlockConversionService( $attributes, $content );
				return $service->convert(
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
