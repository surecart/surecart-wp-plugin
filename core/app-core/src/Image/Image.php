<?php
/**
 * @package   SureCartAppCore
 * @author    SureCart <support@surecart.com>
 * @copyright  SureCart
 * @license   https://www.gnu.org/licenses/gpl-2.0.html GPL-2.0
 * @link      https://surecart.com
 */

namespace SureCartAppCore\Image;

use SureCartCore\Helpers\MixedType;

class Image {
	/**
	 * Get a suitable name for a resized version of an image file.
	 *
	 * @param  string  $filepath
	 * @param  integer $width
	 * @param  integer $height
	 * @param  boolean $crop
	 * @return string
	 */
	protected function getResizedFilename( $filepath, $width, $height, $crop ) {
		$filename = basename( $filepath );

		// match filename extension with dot
		// only the last extension will match when there are multiple ones
		$extension_pattern = '/(\.[^\.]+)$/';

		// add width, height and crop to filename
		$replacement = '-' . $width . 'x' . $height . ( $crop ? '-cropped' : '' ) . '$1';

		return preg_replace( $extension_pattern, $replacement, $filename );
	}

	/**
	 * Resize and store a copy of an image file.
	 *
	 * @param  string  $source
	 * @param  string  $destination
	 * @param  integer $width
	 * @param  integer $height
	 * @param  boolean $crop
	 * @return string
	 */
	protected function store( $source, $destination, $width, $height, $crop ) {
		if ( file_exists( $destination ) ) {
			return $destination;
		}

		$editor = wp_get_image_editor( $source );

		if ( is_wp_error( $editor ) ) {
			return '';
		}

		$editor->resize( $width, $height, $crop );
		$editor->save( $destination );

		return $destination;
	}

	/**
	 * Dynamically generate a thumbnail (if one is not already available) and return the url.
	 *
	 * @param  integer $attachment_id
	 * @param  integer $width
	 * @param  integer $height
	 * @param  boolean $crop
	 * @return string
	 */
	public function thumbnail( $attachment_id, $width, $height, $crop = true ) {
		$width  = absint( $width );
		$height = absint( $height );

		$upload_dir = wp_upload_dir();
		$attachment = wp_get_attachment_metadata( $attachment_id );
		$source     = MixedType::normalizePath( get_attached_file( $attachment_id ) );

		if ( ! $attachment || ! file_exists( $source ) ) {
			return '';
		}

		$attachment_subdirectory = preg_replace( '/\/?[^\/]+\z/', '', $attachment['file'] );
		$filename                = $this->getResizedFilename( $source, $width, $height, $crop );
		$destination             = MixedType::normalizePath( MixedType::normalizePath( $upload_dir['basedir'] ) . DIRECTORY_SEPARATOR . $attachment_subdirectory ) . DIRECTORY_SEPARATOR . $filename;

		$stored = $this->store( $source, $destination, $width, $height, $crop );

		if ( empty( $stored ) ) {
			return '';
		}

		$fileurl = trailingslashit( $upload_dir['baseurl'] ) . $attachment_subdirectory . '/' . $filename;

		return $fileurl;
	}

	/**
	 * Get the SVG file contents.
	 *
	 * @param string $filename
	 * @param array  $attributes
	 *
	 * @return string SVG file contents
	 */
	public function getSvg( $filename, $attributes = array() ): string {
		$plugin_dir = SURECART_IMAGE_DIR . '/svg-icons'; // TODO: Change this to the updated path.
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
