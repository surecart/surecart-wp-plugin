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
	 * Get the thumbnail attribute markup.
	 *
	 * @param string $size The size of the image.
	 * @param array  $attr The attributes for the tag.
	 * @param array  $metadata Additional metadata.
	 *
	 * @return string
	 */
	public function thumbnail( $size = 'full', $attr = [], $metadata = [] ): string {
		return $this->html( $size, $attr, $metadata );
	}

	/**
	 * Get the media attribute markup.
	 *
	 * @param string $size The size of the image.
	 * @param array  $attr The attributes for the tag.
	 * @param array  $metadata Additional metadata.
	 *
	 * @return string
	 */
	public function html( $size = 'full', $attr = array(), $metadata = array() ): string {
		$image = '';

		// Handle media.
		if ( isset( $this->item->media ) ) {
			return $this->item->media->html( $size, $attr );
		}

		// Handle media url.
		if ( isset( $this->item->url ) ) {
			$attributes = $this->attributes( $size, $attr );

			// build the image tag.
			$image = '<img';
			foreach ( $attributes as $key => $value ) {
				$image .= sprintf( ' %s="%s"', $key, esc_attr( $value ) );
			}
			$image .= ' />';
		}

		// add any styles.
		$tags = new \WP_HTML_Tag_Processor( $image );

		// add inline styles.
		if ( ! empty( $attr['style'] ) ) {
			if ( $tags->next_tag( 'img' ) && ! empty( $attr['style'] ) ) {
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
	public function attributes( $size = 'full', $attr = array() ): object {
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
