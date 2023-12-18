<?php

namespace SureCart\Models;

use SureCart\Models\Posts\Price as PricePost;
use SureCart\Models\Product;

/**
 * Price model
 */
class Price extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'prices';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'price';

	/**
	 * Is this cachable?
	 *
	 * @var boolean
	 */
	protected $cachable = true;

	/**
	 * Clear cache when products are updated.
	 *
	 * @var string
	 */
	protected $cache_key = 'products_updated_at';

	/**
	 * The syncable post class.
	 *
	 * @var \SureCart\Models\PostModel
	 */
	protected $post = PricePost::class;

	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setProductAttribute( $value ) {
		$this->setRelation( 'product', $value, Product::class );
	}
}
