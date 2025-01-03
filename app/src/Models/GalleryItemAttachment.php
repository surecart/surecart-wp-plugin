<?php
namespace SureCart\Models;

use SureCart\Models\GalleryItem as ModelsGalleryItem;
use SureCart\Support\Contracts\GalleryItem;

/**
 * Gallery item model
 */
class GalleryItemAttachment extends ModelsGalleryItem implements GalleryItem {
	/**
	 * Create a new gallery item.
	 * This can accept a product media or a post.
	 *
	 * @param int|\WP_Post $item The item.
	 *
	 * @return void
	 */
	public function __construct( $item ) {
		$this->item = get_post( $item );
	}

	/**
	 * Get the media attribute markup.
	 *
	 * @param string $size The size of the image.
	 * @param array  $attr The attributes for the tag.
	 *
	 * @return string
	 */
	public function html( $size = 'full', $attr = [] ): string {
		// If the item is not set, return null.
		if ( ! isset( $this->item->ID ) ) {
			return '';
		}

		// Handle attachments.
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

			$full_data = $this->attributes( 'full' );

			wp_interactivity_state(
				'@surecart/lightbox',
				array(
					'metadata' => array(
						// metadata keyed by unique image id.
						$this->id => array(
							'uploadedSrc'      => $full_data->src,
							'figureClassNames' => 'test',
							'figureStyles'     => 'test',
							'imgClassNames'    => $full_data->class,
							'imgStyles'        => 'test',
							'targetWidth'      => $full_data->width,
							'targetHeight'     => $full_data->height,
							'scaleAttr'        => false,
							'alt'              => 'test',
							'screenReaderText' => 'test',
							'galleryId'        => 'test',
						),
					),
				)
			);

			$tags->set_attribute( 'data-wp-init', 'callbacks.setButtonStyles' );
			$tags->set_attribute( 'data-wp-on-async--load', 'callbacks.setButtonStyles' );
			$tags->set_attribute( 'data-wp-on-async-window--resize', 'callbacks.setButtonStyles' );
			// Sets an event callback on the `img` because the `figure` element can also
			// contain a caption, and we don't want to trigger the lightbox when the
			// caption is clicked.
			$tags->set_attribute( 'data-wp-on-async--click', 'actions.showLightbox' );
			$tags->set_attribute( 'data-wp-class--hide', 'state.isContentHidden' );
			$tags->set_attribute( 'data-wp-class--show', 'state.isContentVisible' );

			return $tags->get_updated_html() .
				'<button
					class="lightbox-trigger"
					type="button"
					aria-haspopup="dialog"
					aria-label="' . esc_attr__( 'Open image in lightbox', 'surecart' ) . '"
					data-wp-init="callbacks.initTriggerButton"
					data-wp-on-async--click="actions.showLightbox"
					data-wp-style--right="state.imageButtonRight"
					data-wp-style--top="state.imageButtonTop"
				>
				<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
					<path fill="#fff" d="M2 0a2 2 0 0 0-2 2v2h1.5V2a.5.5 0 0 1 .5-.5h2V0H2Zm2 10.5H2a.5.5 0 0 1-.5-.5V8H0v2a2 2 0 0 0 2 2h2v-1.5ZM8 12v-1.5h2a.5.5 0 0 0 .5-.5V8H12v2a2 2 0 0 1-2 2H8Zm2-12a2 2 0 0 1 2 2v2h-1.5V2a.5.5 0 0 0-.5-.5H8V0h2Z" />
				</svg>
			</button>';
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
	 * @return object|null
	 */
	public function attributes( $size = 'full', $attr = [] ) {
		$attachment_id = ! empty( $this->item->ID ) ? $this->item->ID : 0;
		$image         = wp_get_attachment_image_src( $attachment_id, $size, $attr['icon'] ?? false, $attr );

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
