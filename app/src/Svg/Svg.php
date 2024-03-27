<?php

namespace SureCart\Svg;

class Svg {
	/**
	 * Get the SVG file contents.
	 *
	 * @param string $filename
	 * @param array  $attributes
	 *
	 * @return string SVG file contents
	 */
	public function get( $filename, $attributes = array() ): string {
		$plugin_dir = SURECART_DIST_DIR . '/icon-assets';
		$file_path  = $plugin_dir . '/' . $filename . '.svg';

		if ( ! file_exists( $file_path ) ) {
			return '';
		}

		$svg = file_get_contents( $plugin_dir . '/' . $filename . '.svg' );

		// Initialize the SVG tag processor.
		$update_svg = new \WP_HTML_Tag_Processor( $svg );
		$update_svg->next_tag( 'svg' );

		// If there are attributes to add, add them.
		if ( ! empty( $attributes ) ) {
			foreach ( $attributes as $attribute => $value ) {
				// If the attribute is 'class', add the class to the SVG file without overwriting the existing classes.
				if ( 'class' === $attribute ) {
					$update_svg->add_class( $value );
					continue;
				}

				// Otherwise, set/update the attribute with the new value
				$update_svg->set_attribute( $attribute, $value );
			}
		}

		// Return the updated SVG string.
		return $update_svg->get_updated_html();
	}
}
