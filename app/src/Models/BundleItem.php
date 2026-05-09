<?php

namespace SureCart\Models;

/**
 * BundleItem model.
 *
 * A bundle item is the join between a bundle Product and one of its component
 * Products. Variant selection happens at checkout (via the bundle line item's
 * `bundle_component_variants` map), not on the bundle item itself.
 *
 * All CRUD proxies to api.surecart.com/bundle_items.
 */
class BundleItem extends Model {
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
	 * The parent bundle Product (the one with bundle: true).
	 *
	 * @param string|array $value Product id or expanded payload.
	 * @return void
	 */
	public function setBundleProductAttribute( $value ) {
		$this->setRelation( 'bundle_product', $value, Product::class );
	}

	/**
	 * @return string|null
	 */
	public function getBundleProductIdAttribute() {
		return $this->getRelationId( 'bundle_product' );
	}

	/**
	 * The component Product included in the bundle.
	 *
	 * Must not itself be a bundle (API returns :cannot_be_bundle).
	 *
	 * @param string|array $value Product id or expanded payload.
	 * @return void
	 */
	public function setComponentProductAttribute( $value ) {
		$this->setRelation( 'component_product', $value, Product::class );
	}

	/**
	 * @return string|null
	 */
	public function getComponentProductIdAttribute() {
		return $this->getRelationId( 'component_product' );
	}

	/**
	 * Display name of the component product.
	 *
	 * @return string
	 */
	public function getNameAttribute() {
		$product = $this->component_product ?? null;
		return is_a( $product, Product::class ) ? (string) ( $product->name ?? '' ) : '';
	}

	/**
	 * Component product's line-item image (small, for list rendering).
	 *
	 * @return object
	 */
	public function getLineItemImageAttribute() {
		$product = $this->component_product ?? null;
		if ( is_a( $product, Product::class ) ) {
			$image = $product->line_item_image ?? null;
			if ( ! empty( $image ) ) {
				return $image;
			}
		}
		return (object) array();
	}
}
