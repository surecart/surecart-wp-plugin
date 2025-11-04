<?php
namespace SureCart\Models;

/**
 * Factory for creating appropriate GalleryItem instances based on attachment type
 */
class GalleryItemAttachment {
	/**
	 * Create a gallery item based on the attachment type.
	 *
	 * @param int|\WP_Post  $item           The attachment item.
	 * @param \WP_Post|null $product_featured_image The featured image (post thumbnail) of the product.
	 *
	 * @return null|GalleryItemImageAttachment|GalleryItemVideoAttachment
	 */
	protected function create( $item, $product_featured_image = null ) {
		// Get the post object to check mime type.
		$post = get_post( $item['id'] ?? $item );

		if ( empty( $post ) ) {
			return null;
		}

		// Check if it's a video based on mime type.
		if ( $post && isset( $post->post_mime_type ) && false !== strpos( $post->post_mime_type, 'video' ) ) {
			return new GalleryItemVideoAttachment( $item, $product_featured_image );
		}

		// Default to image attachment.
		return new GalleryItemImageAttachment( $post );
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
