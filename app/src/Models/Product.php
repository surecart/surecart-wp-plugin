<?php

namespace SureCart\Models;

/**
 * Price model
 */
class Product extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'products';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'product';

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
	 * Set the prices attribute.
	 *
	 * @param  object $value Array of price objects.
	 * @return void
	 */
	public function setPricesAttribute( $value ) {
		$this->setCollection( 'prices', $value, Price::class );
	}

	/**
	 * Set the product attribute
	 *
	 * @param  string $value Product properties.
	 * @return void
	 */
	public function setPurchaseAttribute( $value ) {
		$this->setRelation( 'purchase', $value, Purchase::class );
	}

	/**
	 * Create a new model
	 *
	 * @param array $attributes Attributes to create.
	 *
	 * @return $this|false
	 */
	// protected function create( $attributes = [] ) {
	// $created = parent::create( $attributes );

	// handle error.
	// if ( is_wp_error( $created ) ) {
	// return $created;
	// }

	// already creating product page.
	// if ( $this->fireModelEvent( 'creating_product_page' ) === false ) {
	// return false;
	// }

	// create the draft product page.
	// \SureCart::productPage()->create(
	// [
	// 'post_title'  => $created->name,
	// 'post_status' => 'draft',
	// ],
	// $created->id
	// );

	// fire event.
	// $this->fireModelEvent( 'created_product_page' );

	// created.
	// return $created;
	// }
}
