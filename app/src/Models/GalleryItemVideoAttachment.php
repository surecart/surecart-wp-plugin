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
	 * Get the video poster image ID.
	 *
	 * @return int The Poster image ID.
	 */
	public function posterId() {
		return $this->getMetadata( 'thumbnail_image' )['id'] ?? $this->featured_image->ID ?? null;
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
	public function html( $size = 'full', $attr = [], $metadata = [] ): string {
		// If the item is not set, return null.
		$poster = $this->attributes( $size, $attr );

		if ( empty( $poster ) ) {
			return '';
		}

		return \SureCart::view( 'media/video-thumbnail' )->with( (array) $poster )->toString();
	}

	/**
	 * Get the poster image attributes.
	 *
	 * @param string $size The size of the video.
	 * @param array  $attr The attributes for the tag.
	 *
	 * @return object|null
	 */
	public function attributes( $size = 'full', $attr = [] ): object {
		// If the poster ID is not set, return null.
		if ( empty( $this->posterId() ) ) {
			return (object) [
				'src'   => apply_filters( 'surecart/product-video-poster/fallback_src', trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'images/placeholder.jpg' ),
				'alt'   => get_the_title() ?? __( 'Product Video', 'surecart' ),
				'title' => get_the_title() ?? __( 'Product Video', 'surecart' ),
			];
		}

		$image = wp_get_attachment_image_src( $this->posterId(), $size, $attr['icon'] ?? false, $attr );

		if ( ! $image ) {
			return (object) [];
		}

		list( $src, $width, $height ) = $image;

		$attachment = get_post( $this->posterId() );
		$size_class = $size;

		if ( is_array( $size_class ) ) {
			$size_class = implode( 'x', $size_class );
		}

		$default_attr = array(
			'src'    => $src,
			'class'  => "attachment-$size_class size-$size_class",
			'alt'    => trim( wp_strip_all_tags( get_post_meta( $this->item->ID, '_wp_attachment_image_alt', true ) ) ),
			'width'  => $width,
			'height' => $height,
		);

		/**
		 * Filters the context in which wp_get_attachment_image() is used.
		 *
		 * @since 6.3.0
		 *
		 * @param string $context The context. Default 'wp_get_attachment_image'.
		 */
		$context = apply_filters( 'wp_get_attachment_image_context', 'wp_get_attachment_image' );
		$attr    = wp_parse_args( $attr, $default_attr );

		$loading_attr              = $attr;
		$loading_attr['width']     = $width;
		$loading_attr['height']    = $height;
		$loading_optimization_attr = wp_get_loading_optimization_attributes(
			'img',
			$loading_attr,
			$context
		);

		// Add loading optimization attributes if not available.
		$attr = array_merge( $attr, $loading_optimization_attr );

		// Omit the `decoding` attribute if the value is invalid according to the spec.
		if ( empty( $attr['decoding'] ) || ! in_array( $attr['decoding'], array( 'async', 'sync', 'auto' ), true ) ) {
			unset( $attr['decoding'] );
		}

		/*
		 * If the default value of `lazy` for the `loading` attribute is overridden
		 * to omit the attribute for this image, ensure it is not included.
		 */
		if ( isset( $attr['loading'] ) && ! $attr['loading'] ) {
			unset( $attr['loading'] );
		}

		// If the `fetchpriority` attribute is overridden and set to false or an empty string.
		if ( isset( $attr['fetchpriority'] ) && ! $attr['fetchpriority'] ) {
			unset( $attr['fetchpriority'] );
		}

		// Generate 'srcset' and 'sizes' if not already present.
		if ( empty( $attr['srcset'] ) ) {
			$image_meta = wp_get_attachment_metadata( $this->item->ID );

			if ( is_array( $image_meta ) ) {
				$size_array = array( absint( $width ), absint( $height ) );
				$srcset     = wp_calculate_image_srcset( $size_array, $src, $image_meta, $this->item->ID );
				$sizes      = wp_calculate_image_sizes( $size_array, $src, $image_meta, $this->item->ID );

				if ( $srcset && ( $sizes || ! empty( $attr['sizes'] ) ) ) {
					$attr['srcset'] = $srcset;

					if ( empty( $attr['sizes'] ) ) {
						$attr['sizes'] = $sizes;
					}
				}
			}
		}

		/**
		 * Filters the list of attachment image attributes.
		 *
		 * @since 2.8.0
		 *
		 * @param string[]     $attr       Array of attribute values for the image markup, keyed by attribute name.
		 *                                 See wp_get_attachment_image().
		 * @param WP_Post      $attachment Image attachment post.
		 * @param string|int[] $size       Requested image size. Can be any registered image size name, or
		 *                                 an array of width and height values in pixels (in that order).
		 */
		$attr = apply_filters( 'wp_get_attachment_image_attributes', $attr, $attachment, $size );

		return (object) $attr;
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
	public function video_html( $size = 'full', $attr = [], $metadata = [] ): string {
		// If the item is not set, return null.
		if ( ! isset( $this->item->ID ) ) {
			return '';
		}

		// If the item is not set, return null.
		$poster = $this->attributes( $size, $attr );

		if ( empty( $poster ) ) {
			return '';
		}

		return \SureCart::view( 'media/video' )->with(
			[
				'poster' => $poster->src,
				'src'    => wp_get_attachment_url( $this->item->ID ),
				'alt'    => $this->item->alt_text ?? $this->item->post_title ?? '',
				'title'  => $this->item->post_title ?? '',
				'style'  => ! empty( $this->getMetadata( 'aspect_ratio' ) ) ? 'aspect-ratio: ' . esc_attr( $this->getMetadata( 'aspect_ratio' ) ) . ';' : '',
			]
		)->toString();
	}

	/**
	 * Get the video attributes.
	 *
	 * @param string $size The size of the video.
	 * @param array  $attr The attributes for the tag.
	 *
	 * @return object
	 */
	public function video_attributes( $size = 'full', $attr = [] ): object {
		// If the item is not set, return null.
		if ( ! isset( $this->item->ID ) ) {
			return (object) [];
		}

		$image_attributes = $this->attributes( $size, $attr );

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
				'poster'    => $image_attributes->src ?? '',
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
