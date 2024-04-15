<?php
namespace SureCart\Models\Posts;

use SureCart\Models\Price;
use SureCart\Models\Variant;
use SureCart\Models\VariantOption;
use SureCart\Models\VariantOptionValue;
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
	 * The attributes that are not mass assignable.
	 *
	 * @var array
	 */
	protected $guarded = [ 'name', 'position', 'created_at', 'updated_at' ];

	/**
	 * Additional schema.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return array
	 */
	protected function additionalSchema( $model ) {
		return [
			'min_price_amount' => ( (object) $model->metrics )->min_price_amount ?? 0,
			'max_price_amount' => ( (object) $model->metrics )->max_price_amount ?? 0,
			'prices_count'     => ( (object) $model->metrics )->prices_count ?? 0,
			'post_excerpt'     => $model->description ?? '',
		];
	}

	/**
	 * Sync the model with the post.
	 *
	 * @param \SureCart\Models\Model $model The model.
	 *
	 * @return $this
	 */
	protected function sync( \SureCart\Models\Model $model ) {
		$synced = parent::sync( $model );

		// handle error.
		if ( is_wp_error( $synced ) ) {
			return $synced;
		}

		// there are no variants.
		if ( empty( $model->variant_options->data ) ) {
			return $this;
		}

		if ( empty( $this->post->ID ) ) {
			return $this;
		}

		// delete existing.
		VariantOptionValue::where( 'product_id', $model->id )->delete();

		// create new.
		foreach ( $model->variant_options->data as $option ) {
			foreach ( $option->values as $value ) {
				$created = VariantOptionValue::create(
					[
						'value'      => $value,
						'name'       => $option->name,
						'post_id'    => $this->post->ID,
						'product_id' => $this->post->sc_id,
					]
				);
				if ( is_wp_error( $created ) ) {
					return $created;
				}
			}
		}

		return $this;
	}

	/**
	 * Delete the model.
	 *
	 * @param integer $id The id.
	 *
	 * @return void
	 */
	protected function delete( $id = null ) {
		parent::delete( $id );
		// delete existing.
		VariantOptionValue::where( 'product_id', $this->post->ID )->delete();
	}

	/**
	 * Get the active prices.
	 *
	 * @return array
	 */
	protected function getActivePricesAttribute() {
		return array_filter(
			$this->prices->data ?? [],
			function( $price ) {
				return ! $price->archived;
			}
		);
	}

	/**
	 * Get the variants attribute.
	 *
	 * @param array $value The value.
	 *
	 * @return array
	 */
	protected function getVariantsAttribute( $value ) {
		return $this->getCollection( $value, Variant::class );
	}

	/**
	 * Get the variant options attribute.
	 *
	 * @param array $value The value.
	 *
	 * @return array
	 */
	protected function getVariantOptionsAttribute( $value ) {
		return $this->getCollection( $value, VariantOption::class );
	}

	/**
	 * Get the prices attribute.
	 *
	 * @param array $value The value.
	 *
	 * @return array
	 */
	protected function getPricesAttribute( $value ) {
		return $this->getCollection( $value, Price::class );
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
	protected function getDisplayAmountAttribute() {
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
