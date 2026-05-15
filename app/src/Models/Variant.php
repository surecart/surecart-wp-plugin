<?php

namespace SureCart\Models;

use SureCart\Support\Currency;

/**
 * Variant model
 */

class Variant extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'variants';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'variant';

	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setProductAttribute( $value ) {
		$this->setRelation( 'product', $value, Product::class );
	}

	/**
	 * Set the image attribute
	 *
	 * @param  string $value Image properties.
	 * @return void
	 */
	public function setImageAttribute( $value ) {
		$this->setRelation( 'image', $value, Media::class );
	}

	/**
	 * Get whether stock tracking is effectively disabled for this variant.
	 * Returns null when not set on the variant, so callers can fall back to the product.
	 *
	 * @return bool|null
	 */
	public function getHasUnlimitedStockAttribute() {
		if ( null === $this->stock_enabled ) {
			return null;
		}

		if ( empty( $this->stock_enabled ) ) {
			return true;
		}

		return (bool) $this->allow_out_of_stock_purchases;
	}

	/**
	 * Set the current_release_download attribute
	 *
	 * @param  mixed $value Download properties.
	 * @return void
	 */
	public function setCurrentReleaseDownloadAttribute( $value ) {
		$this->setRelation( 'current_release_download', $value, Download::class );
	}

	/**
	 * Get the display amount attribute
	 *
	 * @return string
	 */
	public function getDisplayAmountAttribute() {
		return empty( $this->amount ) ? '' : Currency::format( $this->amount, $this->currency );
	}

	/**
	 * Get the featured image attribute.
	 *
	 * @return object
	 */
	public function getLineItemImageAttribute() {
		// we have wp media.
		if ( ! empty( $this->metadata->wp_media ) ) {
			$item = GalleryItemAttachment::create( $this->metadata->wp_media );
			if ( ! empty( $item ) && $item->exists() ) {
				return sc_sanitize_image_attributes( $item->attributes( 'thumbnail' ) );
			}
		}

		// we have a fallback model from the platform.
		if ( is_a( $this->image, \SureCart\Models\Media::class ) ) {
			return sc_sanitize_image_attributes( $this->image->attributes( 'thumbnail' ) );
		}

		// always return an empty object.
		return (object) [];
	}
}
