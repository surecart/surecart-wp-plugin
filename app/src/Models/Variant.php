<?php

namespace SureCart\Models;

use SureCart\Models\Posts\Variant as VariantPost;
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
	 * The syncable post class.
	 *
	 * @var \SureCart\Models\PostModel
	 */
	protected $post = VariantPost::class;

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
}
