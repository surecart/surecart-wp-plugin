<?php
namespace SureCart\Models;

use SureCart\Models\Traits\HasAttributes;
use SureCart\Support\Contracts\GalleryItem;

/**
 * Gallery item model
 */
class GalleryItemProductMedia implements GalleryItem {
	use HasAttributes;

	/**
	 * The post item.
	 *
	 * @var \WP_Post
	 */
	protected $product_media;

	/**
	 * Create a new gallery item.
	 * This can accept a product media or a post.
	 *
	 * @param \SureCart\Models\ProductMedia $item The item.
	 *
	 * @return void
	 */
	public function __construct( \SureCart\Models\ProductMedia $item ) {
		$this->product_media = $item;
	}

	/**
	 * Get the media attribute markup.
	 *
	 * @param string $size The size of the image.
	 * @param array  $attr The attributes for the tag.
	 *
	 * @return string
	 */
	public function getImageMarkup( $size = 'full', $attr = [] ) : string {
		$image = '';

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
	 * Get the image data.
	 *
	 * @param string $size The size of the image.
	 * @param array  $attr The attributes for the tag.
	 *
	 * @return array
	 */
	public function getImageAttributes( $size = 'full', $attr = [] ) {
		if ( isset( $this->product_media->media ) ) {
			return $this->product_media->media->getImageAttributes( $size, $attr );
		}

		return $this->product_media;
	}

	/**
	 * Get the image markup.
	 *
	 * @param string $key The key to get.
	 *
	 * @return string
	 */
	public function __get( $key ) {
		if ( isset( $this->post->{$key} ) ) {
			return $this->post->{$key};
		}

		return null;
	}
}
