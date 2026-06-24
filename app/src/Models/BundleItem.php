<?php

namespace SureCart\Models;

/**
 * BundleItem model — the join between a bundle Product and a component Product.
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
	 * Component variants with live stock. A shortcut association returning the
	 * component product's variants one level shallower than the (dropped)
	 * bundle_items.component_product.variants expand.
	 *
	 * @param array $value Variants payload.
	 * @return void
	 */
	public function setComponentVariantsAttribute( $value ) {
		$this->setCollection( 'component_variants', $value, Variant::class );
	}

	/**
	 * Component variant option dimensions (name + values), mirroring component_variants.
	 *
	 * @param array $value Variant options payload.
	 * @return void
	 */
	public function setComponentVariantOptionsAttribute( $value ) {
		$this->setCollection( 'component_variant_options', $value, VariantOption::class );
	}
}
