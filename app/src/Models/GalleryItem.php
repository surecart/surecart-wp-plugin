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
	 * Check if the gallery item exists.
	 *
	 * @return bool
	 */
	public function exists() {
		return isset( $this->item->ID ) || isset( $this->item->id ); // For both WP_Post and ProductMedia.
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
	 * Check if this gallery item is a video.
	 *
	 * @return bool
	 */
	public function isVideo(): bool {
		return $this instanceof GalleryItemVideoAttachment;
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
	 * If $key is provided, returns the single metadata value (or null). If no
	 * key is provided, returns the full metadata array.
	 *
	 * @param string|null $key The key to check or null to get all metadata.
	 *
	 * @return mixed|null|array
	 */
	public function getMetadata( $key = null ) {
		// If no key requested, return the full metadata array.
		if ( empty( $key ) ) {
			return $this->metadata;
		}

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
	 * Set the metadata for the gallery item.
	 *
	 * @param string $key   The key to set.
	 * @param mixed  $value The value to set.
	 *
	 * @return self
	 */
	public function setMetadata( $key, $value ): self {
		$this->metadata[ $key ] = $value;
		return $this;
	}
}
