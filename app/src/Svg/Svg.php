<?php

namespace SureCart\Svg;

/**
 * Svg handler class.
 */
class Svg {
	/**
	 * Get the SVG file contents.
	 *
	 * @param string $filename The name of the SVG file (without the .svg extension).
	 * @param array  $attributes Attributes to add to the SVG tag.
	 *
	 * @return string SVG file contents
	 */
	public function get( $filename, $attributes = array() ): string {
		$plugin_dir = SURECART_DIST_DIR . '/icon-assets';
		$file_path  = $plugin_dir . '/' . $filename . '.svg';

		if ( ! file_exists( $file_path ) ) {
			return '';
		}

		$svg = file_get_contents( $file_path );

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

				// If the attribute is 'style', append the style to the SVG file without overwriting the existing styles.
				if ( 'style' === $attribute ) {
					$existing_style = $update_svg->get_attribute( 'style' );
					$value          = $existing_style ? $existing_style . '; ' . $value : $value;
				}

				// Otherwise, set/update the attribute with the new value.
				$update_svg->set_attribute( $attribute, $value );
			}
		}

		// Add the 'pointer-events: none;' style to make the SVG non-interactive.
		$existing_style = $update_svg->get_attribute( 'style' );
		$new_style      = $existing_style ? $existing_style . '; pointer-events: none;' : 'pointer-events: none;';
		$update_svg->set_attribute( 'style', $new_style );

		// Return the updated SVG string.
		return $update_svg->get_updated_html();
	}
}
