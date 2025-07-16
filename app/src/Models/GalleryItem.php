<?php
namespace SureCart\Models;

use ArrayAccess;
use JsonSerializable;
use SureCart\Concerns\Arrayable;
use SureCart\Concerns\Objectable;
use SureCart\Models\Traits\HasAttributes;

/**
 * GalleryItem model
 */
abstract class GalleryItem implements ArrayAccess, JsonSerializable, Arrayable, Objectable {
	use HasAttributes;

	/**
	 * The item.
	 *
	 * @var \WP_Post|\SureCart\Models\ProductMedia
	 */
	protected $item = null;

	/**
	 * Whether to include lightbox.
	 *
	 * @var bool
	 */
	protected $with_lightbox = false;

	/**
	 * Metadata for the gallery item.
	 *
	 * @var array
	 */
	protected $metadata = [];

	/**
	 * Set the lightbox attribute.
	 *
	 * @param bool $with_lightbox Whether to include lightbox.
	 *
	 * @return self
	 */
	public function withLightbox( $with_lightbox = true ) {
		$this->with_lightbox = $with_lightbox;
		return $this;
	}

	/**
	 * Convert object to array.
	 *
	 * @return array
	 */
	public function toArray() {
		if ( isset( $this->item->ID ) ) {
			$this->item->id = $this->item->ID;
		}
		if ( method_exists( $this->item, 'toArray' ) ) {
			return $this->item->toArray();
		}
		if ( $this->item->guid ) {
			$this->item->url = $this->item->guid;
		}
		return (array) $this->item;
	}

	/**
	 * Get the image markup.
	 *
	 * @param string $key The key to get.
	 *
	 * @return string
	 */
	public function __get( $key ) {
		if ( $this->getMetadata( $key ) ) {
			return $this->getMetadata( $key );
		}

		// normalize the ID.
		if ( 'id' === $key && isset( $this->item->ID ) ) {
			return $this->item->ID;
		}

		if ( isset( $this->item->{$key} ) ) {
			return $this->item->{$key};
		}
		return null;
	}

	/**
	 * Determine if the given attribute exists.
	 *
	 * @param  mixed $offset Name.
	 * @return bool
	 */
	public function offsetExists( $offset ): bool {
		return ! is_null( $this->item->{$offset} );
	}

	/**
	 * Get the value for a given offset.
	 *
	 * @param  mixed $offset Name.
	 * @return mixed
	 */
	#[\ReturnTypeWillChange]
	public function offsetGet( $offset ) {
		return $this->item->{$offset};
	}

	/**
	 * Set the value for a given offset.
	 *
	 * @param  mixed $offset Name.
	 * @param  mixed $value Value.
	 * @return void
	 */
	public function offsetSet( $offset, $value ): void {
		$this->item->{$offset} = $value;
	}

	/**
	 * Unset the value for a given offset.
	 *
	 * @param  mixed $offset Name.
	 * @return void
	 */
	public function offsetUnset( $offset ): void {
		$this->item->{$offset} = null;
	}

	/**
	 * Determine if an attribute or relation exists on the model.
	 *
	 * @param  string $key Name.
	 * @return bool
	 */
	public function __isset( $key ) {
		return isset( $this->item->{$key} ) || isset( $this->metadata[ $key ] );
	}

	/**
	 * Get metadata for the gallery item.
	 *
	 * @param string $key The key to check.
	 *
	 * @return string|null
	 */
	protected function getMetadata( $key ) {
		if ( isset( $this->metadata[ $key ] ) ) {
			return $this->metadata[ $key ];
		}

		// Backward compatibility for variant_option with post meta - sc_variant_option.
		if ( 'variant_option' === $key && isset( $this->item->ID ) ) {
			return get_post_meta( $this->item->ID, 'sc_variant_option', true );
		}

		return null;
	}

	/**
	 * Set the variant option.
	 *
	 * @param string|null $variant_option The variant option.
	 *
	 * @return self
	 */
	public function setVariantOption( $variant_option ): self {
		$this->metadata['variant_option'] = $variant_option;
		return $this;
	}

	/**
	 * Set the thumbnail image.
	 *
	 * @param array|null $thumbnail_image The thumbnail image data.
	 *
	 * @return self
	 */
	public function setThumbnailImage( $thumbnail_image ): self {
		$this->metadata['thumbnail_image'] = $thumbnail_image;
		return $this;
	}

	/**
	 * Set the aspect ratio.
	 *
	 * @param string|null $aspect_ratio The aspect ratio.
	 *
	 * @return self
	 */
	public function setAspectRatio( $aspect_ratio ): self {
		$this->metadata['aspect_ratio'] = $aspect_ratio;
		return $this;
	}
}
