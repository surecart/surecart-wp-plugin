<?php
namespace SureCart\Models;

/**
 * Factory for creating appropriate GalleryItem instances based on attachment type
 */
class GalleryItemAttachment {
	/**
	 * Create a gallery item based on the attachment type.
	 *
	 * @param int|\WP_Post $item           The attachment item.
	 *
	 * @return GalleryItemImageAttachment|GalleryItemVideoAttachment
	 */
	protected function create( $item ) {
		// Get the post object to check mime type.
		$post = get_post( $item['id'] ?? $item );

		// Check if it's a video based on mime type.
		if ( $post && isset( $post->post_mime_type ) && false !== strpos( $post->post_mime_type, 'video' ) ) {
			return new GalleryItemVideoAttachment( $item );
		}

		// Default to image attachment.
		return new GalleryItemImageAttachment( $item );
	}

	/**
	 * Static Facade Accessor
	 *
	 * @param string $method Method to call.
	 * @param mixed  $params Method params.
	 *
	 * @return mixed
	 */
	public static function __callStatic( $method, $params ) {
		return call_user_func_array( [ new static(), $method ], $params );
	}
}
