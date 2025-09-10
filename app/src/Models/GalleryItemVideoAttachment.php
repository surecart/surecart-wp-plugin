<?php
namespace SureCart\Models;

use SureCart\Models\GalleryItem as ModelsGalleryItem;
use SureCart\Support\Contracts\GalleryItem;

/**
 * Gallery item model for video attachments
 */
class GalleryItemVideoAttachment extends ModelsGalleryItem implements GalleryItem {
	/**
	 * Create a new gallery item.
	 *
	 * @param int|\WP_Post $item The item.
	 *
	 * @return void
	 */
	public function __construct( $item ) {
		$this->item = get_post( $item['id'] ?? $item );
	}

	/**
	 * Get the video poster image URL or a fallback.
	 *
	 * @return string The Poster image URL.
	 */
	public function get_video_poster_image(): string {
		$poster_id = $this->getMetadata( 'thumbnail_image' )['id'] ?? $this->featured_image->ID ?? null;
		return ! empty( $poster_id ) ? wp_get_attachment_url( $poster_id ) : trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'images/placeholder.jpg';
	}

	/**
	 * Get the thumbnail attribute markup.
	 *
	 * @param string $size The size of the image.
	 * @param array  $attr The attributes for the tag.
	 * @param array  $metadata Additional metadata.
	 *
	 * @return string
	 */
	public function thumbnail( $size = 'full', $attr = [], $metadata = [] ): string {
		// If the item is not set, return null.
		if ( ! isset( $this->item->ID ) ) {
			return '';
		}

		return \SureCart::view( 'media/video-thumbnail' )->with(
			[
				'src'   => $this->get_video_poster_image(),
				'title' => $this->item->post_title ?? '',
				'alt'   => $this->item->post_title ?? '',
			]
		)->toString();
	}

	/**
	 * Get the media attribute markup.
	 *
	 * @param string $size     The size of the video.
	 * @param array  $attr     The attributes for the tag.
	 * @param array  $metadata Additional metadata for the lightbox.
	 *
	 * @return string
	 */
	public function html( $size = 'full', $attr = [], $metadata = [] ): string {
		// If the item is not set, return null.
		if ( ! isset( $this->item->ID ) ) {
			return '';
		}

		return \SureCart::view( 'media/video' )->with(
			[
				'poster' => $this->get_video_poster_image(),
				'src'    => wp_get_attachment_url( $this->item->ID ),
				'alt'    => $this->item->alt_text ?? $this->item->post_title ?? '',
				'title'  => $this->item->post_title ?? '',
				'style'  => ! empty( $this->getMetadata( 'aspect_ratio' ) ) ? 'aspect-ratio: ' . esc_attr( $this->getMetadata( 'aspect_ratio' ) ) . ';' : '',
			]
		)->toString();
	}

	/**
	 * Get the video data.
	 *
	 * @param string $size The size of the video.
	 * @param array  $attr The attributes for the tag.
	 *
	 * @return object|null
	 */
	public function attributes( $size = 'full', $attr = [] ): object {
		$video = wp_get_attachment_url( $this->item->ID );
		if ( ! $video ) {
			return [];
		}

		$size_class = $size;

		if ( is_array( $size_class ) ) {
			$size_class = implode( 'x', $size_class );
		}

		$attr = (object) wp_parse_args(
			$attr,
			array(
				'src'       => $video,
				'poster'    => $this->get_video_poster_image(),
				'class'     => "attachment-$size_class size-$size_class video-attachment",
				'alt'       => trim( wp_strip_all_tags( get_post_meta( $this->item->ID, '_wp_attachment_image_alt', true ) ) ),
				'mime_type' => get_post_mime_type( $this->item->ID ),
			)
		);

		return apply_filters(
			'surecart_gallery_item_video_attributes',
			$attr,
			$this->item->ID,
			$size,
		);
	}
}
