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
	 * Get the product permalink.
	 *
	 * @return string|false
	 */
	public function getPermalinkAttribute() {
		if ( empty( $this->attributes['id'] ) ) {
			return false;
		}
		return trailingslashit( get_home_url() ) . trailingslashit( 'products' ) . $this->slug;
	}

	/**
	 * Return attached active prices.
	 *
	 * @return array
	 */
	public function activePrices() {
		$active_prices = array_values(
			array_filter(
				$this->prices->data ?? [],
				function( $price ) {
					return ! $price->archived;
				}
			)
		);

		usort(
			$active_prices,
			function( $a, $b ) {
				if ( $a->position == $b->position ) {
					return 0;
				}
				return ( $a->position < $b->position ) ? -1 : 1;
			}
		);

		return $active_prices;
	}

	/**
	 * Get the product template
	 *
	 * @return \WP_Template
	 */
	public function getTemplateAttribute() {
		return get_block_template( $this->attributes['metadata']->wp_template_id ?? 'surecart/surecart//single-product' );
	}
}

