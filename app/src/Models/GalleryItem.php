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
	 * Convert object to array.
	 *
	 * @return Array
	 */
	public function toArray() {
		if ( isset( $this->item->ID ) ) {
			$this->item->id = $this->item->ID;
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
}
