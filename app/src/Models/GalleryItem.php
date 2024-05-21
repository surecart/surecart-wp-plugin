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
		$image = '';

		// Handle attachments.
		if ( isset( $this->post->id ) ) {
			$image = wp_get_attachment_image( $this->post->id, $size, false, $attr );
		}

		// Handle media.
		if ( isset( $this->product_media->media ) ) {
			$image = $this->product_media->media->getImageMarkup( $size, $attr );
		}

		// Handle media url.
		if ( isset( $this->product_media->url ) ) {
			// We cannot lazy load this or use srcset since we don't know the width/height of an external url.
			$image = sprintf( '<img src="%s" alt="%s" title="%s" />', $this->product_media->url, $this->product_media->alt ?? '', $this->product_media->title ?? '' );
		}

		// add height style.
		$tags = new \WP_HTML_Tag_Processor( $image );
		if ( $tags->next_tag( 'img' ) && ! empty( $attr['height'] ) ) {
			$tags->set_attribute( 'style', 'height: ' . $attr['height'] );
		}

		// return updated html.
		return $tags->get_updated_html();
	}

	/**
	 * Get the image markup.
	 *
	 * @param string $size The size of the image.
	 * @param array  $attr The attributes for the tag.
	 *
	 * @return string
	 */
	public function __get( $key ) {
		if ( isset( $this->product_media->{$key} ) ) {
			return $this->product_media->{$key};
		}

		if ( isset( $this->post->{$key} ) ) {
			return $this->post->{$key};
		}

		return null;
	}
}
