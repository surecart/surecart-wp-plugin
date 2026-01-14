<?php

namespace SureCart\Models;

use SureCart\Models\Concerns\ImportModel;

/**
 * Product import model
 */
class ProductCollectionImport extends ImportModel {
	/**
	 * Rest API endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'imports/product_collections';

	/**
	 * Set the data attribute as an array of Product models.
	 * Accepts an iterable of attribute arrays/Products or a single Product instance.
	 *
	 * @param mixed $value Iterable of product attributes or Product instance.
	 *
	 * @return void
	 */
	public function setDataAttribute( $value ) {
		$models = [];
		if ( ! empty( $value ) && is_array( $value ) ) {
			foreach ( $value as $attributes ) {
				$models[] = is_a( $attributes, ProductCollection::class ) ? $attributes : new ProductCollection( $attributes );
			}
			$value = $models;
		}
		$this->attributes['data'] = $value;
	}
}
