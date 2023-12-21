<?php
namespace SureCart\Models\Posts;

use SureCart\Support\Currency;

/**
 * Handles the product post type.
 */
class Product extends PostModel {
	/**
	 * Holds the user.
	 *
	 * @var string
	 */
	protected $post_type = 'sc_product';

	/**
	 * The model type
	 *
	 * @var string
	 */
	protected $model_type = 'product';

	/**
	 * Product Model
	 *
	 * @var string
	 */
	protected $model = \SureCart\Models\Product::class;

	/**
	 * Additional schema.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return array
	 */
	protected function additionalSchema( $model ) {
		return [
			'min_price_amount' => $model->metrics->min_price_amount,
			'max_price_amount' => $model->metrics->max_price_amount,
			'prices_count'     => $model->metrics->prices_count,
			'post_excerpt'     => $model->description,
		];
	}

	/**
	 * Get the active prices.
	 *
	 * @return array
	 */
	protected function getActivePricesAttribute() {
		return array_filter(
			$this->prices ?? [],
			function( $price ) {
				return ! $price->archived;
			}
		);
	}

	/**
	 * Get the amount attribute.
	 *
	 * @return string
	 */
	protected function getAmountAttribute() {
		$active = $this->getActivePricesAttribute();
		if ( empty( $active[0] ) ) {
			return '';
		}
		return $active[0]->amount;
	}

	/**
	 * Get the currency attribute.
	 *
	 * @return string
	 */
	protected function getCurrencyAttribute() {
		$active = $this->getActivePricesAttribute();
		if ( empty( $active[0] ) ) {
			return '';
		}
		return $active[0]->currency ?? 'usd';
	}

	/**
	 * Get the display price attribute.
	 *
	 * @return string
	 */
	protected function getDisplayPriceAttribute() {
		$amount = $this->getAmountAttribute();
		if ( empty( $amount ) ) {
			return '';
		}
		return Currency::format( $amount, $this->getCurrencyAttribute() );
	}

	/**
	 * Is in stock attribute.
	 *
	 * @return boolean
	 */
	protected function getIsInStockAttribute() : bool {
		if ( $this->allow_out_of_stock_purchases ) {
			return true;
		}
		return $this->available_stock > 0;
	}

	/**
	 * Is out of stock attribute.
	 *
	 * @return boolean
	 */
	protected function getIsOutOfStockAttribute() : bool {
		return ! $this->is_in_stock;
	}

	/**
	 * Is low stock attribute.
	 *
	 * @return boolean
	 */
	protected function getIslowStockAttribute() : bool {
		if ( $this->allow_out_of_stock_purchases ) {
			return true;
		}
		return $this->available_stock <= apply_filters( 'surecart/low_stock_threshold', 10 );
	}
}
