<?php

namespace SureCart\Models;

/**
 * ProductMedia model
 */
class ProductMedia extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'product_medias';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'product_media';

	/**
	 * Does an update clear account cache?
	 *
	 * @var boolean
	 */
	protected $clears_account_cache = true;

	/**
	 * Set the media attribute
	 *
	 * @param  string $value Media properties.
	 * @return void
	 */
	public function setMediaAttribute( $value ) {
		$this->setRelation( 'media', $value, Media::class );
	}

	/**
	 * Get the url for the product media.
	 * We do this because the media object is not always set.
	 *
	 * @param integer $size The size.
	 *
	 * @return string
	 */
	public function getUrl( $size ) {
		return ! empty( $this->media ) ? $this->media->getUrl( $size ) : $this->url;
	}

	/**
	 * Get the width for the product media.
	 *
	 * @return integer|null
	 */
	public function getWidthAttribute() {
		return ! empty( $this->media ) ? $this->media->width : null;
	}

	/**
	 * Get the width for the product media.
	 *
	 * @return integer|null
	 */
	public function getHeightAttribute() {
		return ! empty( $this->media ) ? $this->media->width : null;
	}

	/**
	 * Get the srcset for the product media.
	 * We do this because the media object is not always set.
	 *
	 * @param array[integer] $sizes The sizes.
	 *
	 * @return string
	 */
	public function getSrcset( $sizes ) {
		return ! empty( $this->media ) ? $this->media->withImageSizes( $sizes )->srcset : '';
	}

	/**
	 * Download the media to the wp install.
	 *
	 * @return integer The attachment id.
	 */
	public function download() {
		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';

		// Get the URL to download.
		$url = ! empty( $this->media->url ) ? $this->media->url . '?' . $this->media->filename : $this->url;

		// Check if this is a video.
		$is_video = false;
		if ( ! empty( $this->media->mime_type ) && strpos( $this->media->mime_type, 'video' ) !== false ) {
			$is_video = true;
		} elseif ( ! empty( $url ) ) {
			$file_extension = pathinfo( $url, PATHINFO_EXTENSION );
			if ( in_array( strtolower( $file_extension ), [ 'mp4', 'webm', 'ogg' ] ) ) {
				$is_video = true;
			}
		}

		// For videos, we need to use media_sideload_image with specific arguments.
		if ( $is_video ) {
			// Use wp_handle_sideload for videos.
			$tmp = download_url( $url );
			if ( is_wp_error( $tmp ) ) {
				return 0;
			}

			$file_array = array(
				'name'     => basename( $url ),
				'tmp_name' => $tmp,
			);

			// Do the validation and storage.
			$id = media_handle_sideload( $file_array, 0 );

			// Clean up the temporary file.
			@unlink( $tmp );

			if ( is_wp_error( $id ) ) {
				return 0;
			}

			return $id;
		}

		// For images, use the standard media_sideload_image function.
		return \media_sideload_image( $url, 0, null, 'id' );
	}
}
