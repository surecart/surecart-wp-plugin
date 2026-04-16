<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasPrice;
use SureCart\Models\Traits\HasProduct;

/**
 * BundleItem model.
 *
 * A bundle item defines a component price (and optionally a pinned variant)
 * within a bundle price. All CRUD proxies to api.surecart.com/bundle_items.
 */
class BundleItem extends Model {
	use HasPrice;
	use HasProduct;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'bundle_items';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'bundle_item';

	/**
	 * Set the variant attribute.
	 *
	 * @param  string $value Variant properties.
	 * @return void
	 */
	public function setVariantAttribute( $value ) {
		$this->setRelation( 'variant', $value, Variant::class );
	}

	/**
	 * Set the bundle_price attribute (the parent bundle price).
	 *
	 * @param  string $value Price properties.
	 * @return void
	 */
	public function setBundlePriceAttribute( $value ) {
		$this->setRelation( 'bundle_price', $value, Price::class );
	}
}
