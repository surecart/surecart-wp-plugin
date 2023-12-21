<?php

namespace SureCart\Models;

use SureCart\Models\Posts\VariantOption as VariantOptionPost;

/**
 * Variant Option model.
 */
class VariantOption extends Model {
	/**
	 * Rest API endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'variant_options';

	/**
	 * Object name.
	 *
	 * @var string
	 */
	protected $object_name = 'variant_option';

	/**
	 * The syncable post class.
	 *
	 * @var \SureCart\Models\PostModel
	 */
	protected $post = VariantOptionPost::class;

	/**
	 * Set the product attribute.
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setProductAttribute( $value ) {
		$this->setRelation( 'product', $value, Product::class );
	}
}
