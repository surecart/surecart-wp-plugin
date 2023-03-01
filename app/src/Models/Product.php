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
	 * Buy link model
	 *
	 * @return \SureCart\Models\BuyLink
	 */
	public function buyLink() {
		return new BuyLink( $this );
	}

		/**
		 * Should we show this item?
		 *
		 * @param string $item The name of the item.
		 *
		 * @return boolean
		 */
	public function showItem( $item ) {
		switch ( $item ) {
			case 'image':
				return 'true' !== ( $this->product->metadata->wp_buy_link_product_image_disabled ?? '' );
			case 'description':
				return 'true' !== ( $this->product->metadata->wp_buy_link_product_description_disabled ?? '' );
			case 'coupon':
				return 'true' !== ( $this->product->metadata->wp_buy_link_coupon_field_disabled ?? '' );
		}
		return false;
	}
}
