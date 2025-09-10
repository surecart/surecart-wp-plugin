<?php
namespace SureCart\Models;

/**
 * Factory for creating appropriate GalleryItem instances based on attachment type
 */
class GalleryItemAttachmentFactory {
	/**
	 * Create a gallery item based on the attachment type.
	 *
	 * @param int|\WP_Post $item           The attachment item.
	 * @param string|null  $featured_image The featured image URL for fallback.
	 *
	 * @return GalleryItemImageAttachment|GalleryItemVideoAttachment
	 */
	public static function create( $item ) {
		// Get the post object to check mime type.
		$post = get_post( $item['id'] ?? $item );

		// Check if it's a video based on mime type.
		if ( $post && isset( $post->post_mime_type ) && false !== strpos( $post->post_mime_type, 'video' ) ) {
			return new GalleryItemVideoAttachment( $item );
		}

		// Default to image attachment.
		return new GalleryItemImageAttachment( $item );
	}
}
