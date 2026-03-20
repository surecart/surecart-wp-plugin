<?php
namespace SureCart\Models;

/**
 * Factory for creating appropriate GalleryItem instances based on attachment type
 */
class GalleryItemAttachment {
	/**
	 * Create a gallery item based on the attachment type.
	 *
	 * @param int|array|\WP_Post $item The attachment item (ID, array with 'id' key, or WP_Post object).
	 * @param \WP_Post|null      $product_featured_image The featured image (post thumbnail) of the product.
	 *
	 * @return null|GalleryItemImageAttachment|GalleryItemVideoAttachment
	 */
	protected function create( $item, $product_featured_image = null ) {
		// Normalize the item to a post ID.
		$post_id = null;

		if ( is_numeric( $item ) ) {
			// It's an integer ID.
			$post_id = (int) $item;
		} elseif ( is_array( $item ) && isset( $item['id'] ) ) {
			// It's an array with an 'id' key.
			$post_id = (int) $item['id'];
		} elseif ( $item instanceof \WP_Post ) {
			// It's already a WP_Post object.
			$post_id = $item->ID;
		} elseif ( is_object( $item ) && isset( $item->id ) ) {
			// It's an object with an 'id' property (e.g., stdClass from JSON decode).
			$post_id = (int) $item->id;
		} else {
			// Invalid type, return null.
			return null;
		}

		// Get the post object to check mime type.
		$post = get_post( $post_id );

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
