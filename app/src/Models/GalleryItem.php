<?php
namespace SureCart\Models;

use SureCart\Models\Concerns\Facade;
use SureCart\Models\Traits\HasAttributes;

/**
 * Gallery item model
 */
class GalleryItem {
	use Facade, HasAttributes;

	/**
	 * The media item.
	 *
	 * @var \SureCart\Models\ProductMedia
	 */
	protected $product_media;

	/**
	 * The post item.
	 *
	 * @var \WP_Post
	 */
	protected $post;

	/**
	 * Create a new gallery item.
	 * This can accept a product media or a post.
	 *
	 * @param mixed $item The item.
	 */
	public function __construct( $item ) {
		if ( is_a( $item, \SureCart\Models\ProductMedia::class ) ) {
			$this->product_media = $item;
		} else {
			$this->post = get_post( $item );
		}
	}

	/**
	 * Get the media attribute markup.
	 *
	 * @param string $size The size of the image.
	 * @param array  $attr The attributes for the tag.
	 *
	 * @return string
	 */
	protected function getImageMarkup( $size = 'full', $attr = [] ) {
		// Handle attachments.
		if ( isset( $this->post->id ) ) {
			return wp_get_attachment_image( $this->post->id, $size, false, $attr );
		}

		// Handle media.
		if ( isset( $this->product_media->media ) ) {
			return $this->product_media->media->getImageMarkup( $size, $attr );
		}

		// Handle media url.
		if ( isset( $this->product_media->url ) ) {
			// We cannot lazy load this or use srcset since we don't know the width/height of an external url.
			return sprintf( '<img src="%s" alt="%s" title="%s" />', $this->product_media->url, $this->product_media->alt ?? '', $this->product_media->title ?? '' );
		}

		// Handle nothing.
		return '';
	}
}
