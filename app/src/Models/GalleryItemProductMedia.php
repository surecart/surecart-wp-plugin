<?php
namespace SureCart\Models;

use SureCart\Models\GalleryItem as ModelsGalleryItem;
use SureCart\Support\Contracts\GalleryItem;

/**
 * Gallery item model
 */
class GalleryItemProductMedia extends ModelsGalleryItem implements GalleryItem {
	/**
	 * Create a new gallery item.
	 * This can accept a product media or a post.
	 *
	 * @param \SureCart\Models\ProductMedia $item The item.
	 *
	 * @return void
	 */
	public function __construct( \SureCart\Models\ProductMedia $item ) {
		$this->item = $item;
	}

	/**
	 * Generate a reliable thumbnail for video.
	 *
	 * @return string The thumbnail URL
	 */
	public function get_video_thumbnail_url() {
		// If we have a media object with a thumbnail.
		if ( isset( $this->item->media ) && isset( $this->item->media->thumbnail_url ) ) {
			return $this->item->media->thumbnail_url;
		}

		// Check if this is an attachment and has a featured image.
		if ( isset( $this->item->media ) && isset( $this->item->media->id ) ) {
			$attachment_id = $this->item->media->id;
			if ( is_numeric( $attachment_id ) ) {
				// Get the featured image of the attachment.
				$thumbnail_id = get_post_thumbnail_id( $attachment_id );
				if ( $thumbnail_id ) {
					$thumbnail_url = wp_get_attachment_url( $thumbnail_id );
					if ( $thumbnail_url ) {
						return $thumbnail_url;
					}
				}
			}
		}

		// Check if the product has a featured image.
		if ( isset( $this->item->product ) && is_string( $this->item->product ) ) {
			// Get the product post ID from the product ID.
			$product_posts = get_posts(
				[
					'post_type'      => 'sc_product',
					'meta_query'     => [
						[
							'key'   => 'sc_id',
							'value' => $this->item->product,
						],
					],
					'posts_per_page' => 1,
				]
			);

			if ( ! empty( $product_posts ) ) {
				$product_post_id = $product_posts[0]->ID;
				$thumbnail_id    = get_post_thumbnail_id( $product_post_id );
				if ( $thumbnail_id ) {
					$thumbnail_url = wp_get_attachment_url( $thumbnail_id );
					if ( $thumbnail_url ) {
						return $thumbnail_url;
					}
				}
			}
		}

		// Fallback to a default product placeholder image.
		return esc_url_raw( trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'images/placeholder.jpg' );
	}

	/**
	 * Get the media attribute markup.
	 *
	 * @param string $size The size of the image.
	 * @param array  $attr The attributes for the tag.
	 * @param array  $metadata Additional metadata for the media.
	 *
	 * @return string
	 */
	public function html( $size = 'full', $attr = array(), $metadata = array() ): string {
		$media_html = '';
		$is_video   = false;

		// Check if this is a video.
		if ( isset( $this->item->media ) && isset( $this->item->media->mime_type ) && strpos( $this->item->media->mime_type, 'video' ) !== false ) {
			$is_video = true;
		} elseif ( isset( $this->item->url ) ) {
			$file_extension = pathinfo( $this->item->url, PATHINFO_EXTENSION );
			if ( in_array( strtolower( $file_extension ), [ 'mp4', 'webm', 'ogg' ] ) ) {
				$is_video = true;
			}
		}

		// Handle media based on type.
		if ( $is_video ) {
			if ( 'thumbnail' === $size ) {
				$thumbnail_url = $this->get_video_thumbnail_url();
				$attributes    = $this->attributes( $size, $attr );

				$media_html  = '<div class="sc-video-thumbnail">';
				$media_html .= '<img src="' . esc_url( $thumbnail_url ) . '" class="' . esc_attr( $attributes->class ) . '" alt="' . esc_attr__( 'Video thumbnail', 'surecart' ) . '"/>';
				$media_html .= '<div class="sc-video-play-button"></div>';
				$media_html .= '</div>';

				return $media_html;
			}

			// Video handling for main display.
			$src        = isset( $this->item->media ) ? $this->item->media->url : $this->item->url;
			$attributes = $this->attributes( $size, $attr );

			// Build video tag.
			$media_html  = '<div class="sc-video-container">';
			$media_html .= '<video';

			// Add common attributes.
			$media_html .= ' src="' . esc_url( $src ) . '"';
			$media_html .= ' controls';
			$media_html .= ' playsinline';
			$media_html .= ' class="' . esc_attr( $attributes->class ) . '"';

			// Add style if provided.
			if ( ! empty( $attr['style'] ) ) {
				$media_html .= ' style="' . esc_attr( $attr['style'] ) . '"';
			}

			// Add loading attribute if provided.
			if ( ! empty( $attr['loading'] ) ) {
				$media_html .= ' loading="' . esc_attr( $attr['loading'] ) . '"';
			}

			// Add poster (thumbnail).
			$thumbnail_url = $this->get_video_thumbnail_url();
			if ( $thumbnail_url ) {
				$media_html .= ' poster="' . esc_url( $thumbnail_url ) . '"';
			}

			// Close video tag.
			$media_html .= '></video>';
			$media_html .= '</div>';
		} else {
			// Handle media for images.
			if ( isset( $this->item->media ) ) {
				return $this->item->media->html( $size, $attr );
			}

			// Handle media url for images.
			if ( isset( $this->item->url ) ) {
				$attributes = $this->attributes( $size, $attr );

				// build the image tag.
				$media_html = '<img';
				foreach ( $attributes as $key => $value ) {
					$media_html .= sprintf( ' %s="%s"', $key, esc_attr( $value ) );
				}
				$media_html .= ' />';
			}
		}

		// add any styles.
		$tags = new \WP_HTML_Tag_Processor( $media_html );

		// add inline styles.
		if ( ! empty( $attr['style'] ) ) {
			if ( $is_video ) {
				if ( $tags->next_tag( 'video' ) ) {
					$tags->set_attribute( 'style', $attr['style'] );
				}
			} elseif ( $tags->next_tag( 'img' ) ) {
					$tags->set_attribute( 'style', $attr['style'] );
			}
		}

		if ( $this->with_lightbox && ! $is_video ) {
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
								'scaleAttr'        => false, // false or 'contain'.
								'alt'              => $full_data->alt,
								// translators: %s is the image title.
								'screenReaderText' => sprintf( __( 'Viewing image: %s.', 'surecart' ), $full_data->alt ),
								'galleryId'        => get_the_ID(),
							),
						),
					),
				)
			);

			$tags->set_attribute( 'data-wp-on-async--load', 'callbacks.setImageRef' );
			$tags->set_attribute( 'data-wp-init', 'callbacks.setImageRef' );
			$tags->set_attribute( 'data-wp-on-async--click', 'actions.showLightbox' );
			$tags->set_attribute( 'data-wp-class--sc-hide', 'state.isContentHidden' );
			$tags->set_attribute( 'data-wp-class--sc-show', 'state.isContentVisible' );
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
	 * Get the image data.
	 *
	 * @param string $size The size of the image.
	 * @param array  $attr The attributes for the tag.
	 *
	 * @return object
	 */
	public function attributes( $size = 'full', $attr = array() ) {
		// Check if this is a video.
		$is_video = false;
		if ( isset( $this->item->media ) && isset( $this->item->media->mime_type ) && strpos( $this->item->media->mime_type, 'video' ) !== false ) {
			$is_video = true;
		} elseif ( isset( $this->item->url ) ) {
			$file_extension = pathinfo( $this->item->url, PATHINFO_EXTENSION );
			if ( in_array( strtolower( $file_extension ), [ 'mp4', 'webm', 'ogg' ] ) ) {
				$is_video = true;
			}
		}

		if ( $is_video ) {
			$attachment_class = 'attachment-' . $size . ' size-' . $size . ' video-attachment';

			return (object) array(
				'src'      => $this->get_video_thumbnail_url(),
				'class'    => $attachment_class . ' ' . ( ! empty( $attr['class'] ) ? $attr['class'] : '' ),
				'alt'      => get_the_title(),
				'is_video' => true,
			);
		}

		if ( isset( $this->item->media ) ) {
			return $this->item->media->attributes( $size, $attr );
		}

		$attachment_class = 'attachment-' . $size . ' size-' . $size;

		return (object) array(
			'src'   => $this->item->url,
			'class' => $attachment_class . ' ' . ( ! empty( $attr['class'] ) ? $attr['class'] : '' ),
			'alt'   => get_the_title(),
		);
	}
}
