<?php
namespace SureCart\Models;

use SureCart\Models\GalleryItem as ModelsGalleryItem;
use SureCart\Support\Contracts\GalleryItem;

/**
 * Gallery item model
 */
class GalleryItemAttachment extends ModelsGalleryItem implements GalleryItem {
	/**
	 * Product featured image URL.
	 *
	 * This is used for fallback when the attachment does not have a thumbnail or poster image.
	 *
	 * @var string|null
	 */
	private $featured_image_url = null;

	/**
	 * Create a new gallery item.
	 * This can accept a product media or a post.
	 *
	 * @param int|\WP_Post $item The item.
	 * @param string|null  $featured_image_url The featured image URL for the product.
	 *
	 * @return void
	 */
	public function __construct( $item, $featured_image_url = null ) {
		$this->item               = get_post( $item );
		$this->featured_image_url = $featured_image_url;
	}

	/**
	 * Generate a reliable thumbnail image URL for video attachments
	 *
	 * @param int $attachment_id The attachment ID.
	 *
	 * @return string The thumbnail URL.
	 */
	public function get_video_thumbnail_url( $attachment_id ) {
		// First check if the video has a poster/thumbnail set.
		$thumb_id = get_post_thumbnail_id( $attachment_id );
		if ( $thumb_id ) {
			$thumb_url = wp_get_attachment_image_url( $thumb_id, 'thumbnail' );
			if ( $thumb_url ) {
				return $thumb_url;
			}
		}

		// Try to get a frame from the video as thumbnail using WordPress metadata.
		$metadata = wp_get_attachment_metadata( $attachment_id );
		if ( ! empty( $metadata['image']['src'] ) ) {
			return $metadata['image']['src'];
		}

		// Check if WordPress has generated any thumbnails for this video.
		$thumb_sizes = [ 'thumbnail', 'medium', 'large' ];
		foreach ( $thumb_sizes as $size ) {
			$thumb = image_downsize( $attachment_id, $size );
			if ( $thumb && ! empty( $thumb[0] ) ) {
				return $thumb[0];
			}
		}

		// If WordPress hasn't generated thumbnails, check for video thumbnail plugins.
		if ( function_exists( 'get_video_thumbnail' ) ) {
			$thumb_url = get_video_thumbnail( $attachment_id );
			if ( $thumb_url ) {
				return $thumb_url;
			}
		}

		// Fallback to a featured image / default placeholder image if no thumbnail is found.
		return $this->featured_image_url ?? esc_url_raw( trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'images/placeholder.jpg' );
	}

	/**
	 * Check if the media item is a video.
	 *
	 * @return bool
	 */
	public function isVideo(): bool {
		return strpos( get_post_mime_type( $this->item->ID ?? '' ), 'video' ) !== false;
	}

	/**
	 * Get the HTML for the video attachment.
	 *
	 * @param string $size The size of the video.
	 * @param array  $attr The attributes for the tag.
	 * @param array  $metadata Additional metadata for the lightbox.
	 *
	 * @return string
	 */
	public function getVideoHtml( $size = 'full', $attr = [], $metadata = [] ): string {
		$html                = '';
		$video_thumbnail_url = $this->get_video_thumbnail_url( $this->item->ID );

		if ( 'thumbnail' === $size ) {
			$html  = '<div class="sc-video-thumbnail">';
			$html .= '<img src="' . $video_thumbnail_url . '" alt="' . esc_attr__( 'Video thumbnail', 'surecart' ) . '" >';
			$html .= '<div class="sc-video-play-button"></div>';
			$html .= '</div>';

			return $html;
		}

		// For main display, handle video attachments.
		$video_url = wp_get_attachment_url( $this->item->ID );
		$html      = '<div class="sc-video-container">';
		$html     .= wp_video_shortcode(
			[
				'src'      => $video_url,
				'poster'   => $video_thumbnail_url,
				'loop'     => '',
				'autoplay' => '',
				'muted'    => 'false',
				'preload'  => 'metadata',
				'class'    => 'wp-video-shortcode',
			],
			''
		);
		$html     .= '</div>';

		return $html;
	}

	/**
	 * Get the HTML for the image attachment.
	 *
	 * @param string $size The size of the image.
	 * @param array  $attr The attributes for the tag.
	 * @param array  $metadata Additional metadata for the lightbox.
	 *
	 * @return string
	 */
	public function getImageHtml( $size = 'full', $attr = [], $metadata = [] ): string {
		// Handle image attachments.
		$image = wp_get_attachment_image( $this->item->ID, $size, false, $attr );

		// add any styles.
		$tags = new \WP_HTML_Tag_Processor( $image );

		// get the image tag.
		$has_image = $tags->next_tag( 'img' );

		// add inline styles.
		if ( ! empty( $attr['style'] ) ) {
			if ( $has_image && ! empty( $attr['style'] ) ) {
				$tags->set_attribute( 'style', $attr['style'] );
			}
		}

		if ( $this->with_lightbox ) {
			$this->with_lightbox = false; // reset to false.

			// get the image data.
			$full_data = $this->attributes( 'full' );

			// set the lightbox state.
			wp_interactivity_state(
				'surecart/lightbox',
				array(
					'metadata' => array(
						// metadata keyed by unique image id.
						$this->id => wp_parse_args(
							$metadata,
							array(
								'uploadedSrc'      => $full_data->src,
								'imgClassNames'    => $full_data->class,
								'targetWidth'      => $full_data->width,
								'targetHeight'     => $full_data->height,
								'scaleAttr'        => false, // false or 'contain'.
								'alt'              => $full_data->alt,
								// translators: %s is the image title.
								'screenReaderText' => sprintf( __( 'Viewing image: %s.', 'surecart' ), $this->post_title ),
								'galleryId'        => get_the_ID(),
							),
						),
					),
				)
			);

			$tags->set_attribute( 'data-wp-on-async--load', 'callbacks.setImageRef' );
			$tags->set_attribute( 'data-wp-init', 'callbacks.setImageRef' );
			$tags->set_attribute( 'data-wp-on-async--click', 'actions.showLightbox' );
			$tags->set_attribute( 'data-wp-class--hide', 'state.isContentHidden' );
			$tags->set_attribute( 'data-wp-class--show', 'state.isContentVisible' );
			$tags->add_class( 'has-image-lightbox' );

			// add the lightbox trigger button.
			return $tags->get_updated_html() .
				'<button
					class="lightbox-trigger"
					type="button"
					aria-haspopup="dialog"
					aria-label="' . esc_attr__( 'Expand image', 'surecart' ) . '"
					data-wp-init="callbacks.initTriggerButton"
					data-wp-on-async--click="actions.showLightbox"
					data-wp-style--right="state.imageButtonRight"
					data-wp-style--top="state.imageButtonTop"
				>
				' . \SureCart::svg()->get(
						'maximize',
						[
							'width'  => 16,
							'height' => 16,
						]
					) . '
			</button>';
		}

		// return updated html.
		return $tags->get_updated_html();
	}

	/**
	 * Get the media attribute markup.
	 *
	 * @param string $size The size of the image.
	 * @param array  $attr The attributes for the tag.
	 * @param array  $metadata Additional metadata for the lightbox.
	 *
	 * @return string
	 */
	public function html( $size = 'full', $attr = [], $metadata = [] ): string {
		// If the item is not set, return null.
		if ( ! isset( $this->item->ID ) ) {
			return '';
		}

		if ( $this->isVideo() ) {
			return $this->getVideoHtml( $size, $attr, $metadata );
		}

		return $this->getImageHtml( $size, $attr, $metadata );
	}

	/**
	 * Get the image data.
	 *
	 * @param string $size The size of the image.
	 * @param array  $attr The attributes for the tag.
	 *
	 * @return object|null
	 */
	public function attributes( $size = 'full', $attr = [] ) {
		$attachment_id = ! empty( $this->item->ID ) ? $this->item->ID : 0;

		// Check if this is a video attachment.
		if ( $this->isVideo() ) {
			$video_url  = wp_get_attachment_url( $attachment_id );
			$attachment = get_post( $attachment_id );
			$size_class = $size;

			if ( is_array( $size_class ) ) {
				$size_class = implode( 'x', $size_class );
			}

			return (object) [
				'url'       => $video_url,
				'src'       => $this->get_video_thumbnail_url( $attachment_id ),
				'class'     => "attachment-$size_class size-$size_class video-attachment",
				'alt'       => trim( strip_tags( get_post_meta( $attachment_id, '_wp_attachment_image_alt', true ) ) ),
				'mime_type' => get_post_mime_type( $attachment_id ),
				'is_video'  => true,
			];
		}

		// For images, use the standard approach.
		$image = wp_get_attachment_image_src( $attachment_id, $size, $attr['icon'] ?? false, $attr );

		if ( $image ) {
			list( $src, $width, $height ) = $image;

			$attachment = get_post( $attachment_id );
			$size_class = $size;

			if ( is_array( $size_class ) ) {
				$size_class = implode( 'x', $size_class );
			}

			$default_attr = array(
				'src'    => $src,
				'class'  => "attachment-$size_class size-$size_class",
				'alt'    => trim( strip_tags( get_post_meta( $attachment_id, '_wp_attachment_image_alt', true ) ) ),
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
				$image_meta = wp_get_attachment_metadata( $attachment_id );

				if ( is_array( $image_meta ) ) {
					$size_array = array( absint( $width ), absint( $height ) );
					$srcset     = wp_calculate_image_srcset( $size_array, $src, $image_meta, $attachment_id );
					$sizes      = wp_calculate_image_sizes( $size_array, $src, $image_meta, $attachment_id );

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

		return (object) [];
	}
}
