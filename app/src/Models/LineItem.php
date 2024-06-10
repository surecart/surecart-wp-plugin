<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasCheckout;
use SureCart\Models\Traits\HasPrice;
use SureCart\Support\Currency;
use SureCart\Models\Traits\HasProduct;

/**
 * Price model
 */
class LineItem extends Model {
	use HasPrice, HasCheckout, HasProduct;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'line_items';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'line_item';

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
	 * Upsell a line item.
	 *
	 * @param array $attributes The attributes to update.
	 * @return \WP_Error|mixed
	 */
	protected function upsell( $attributes = [] ) {
		if ( $this->fireModelEvent( 'upselling' ) === false ) {
			return false;
		}

		$updated = $this->makeRequest(
			[
				'method' => 'POST',
				'query'  => $this->query,
				'body'   => [
					$this->object_name => $attributes,
				],
			],
			'line_items/upsell'
		);

		if ( $this->isError( $updated ) ) {
			return $updated;
		}

		$this->resetAttributes();

		$this->fill( $updated );

		$this->fireModelEvent( 'upsold' );

		// clear account cache.
		if ( $this->cachable || $this->clears_account_cache ) {
			\SureCart::account()->clearCache();
		}

		return $this;
	}

	/**
	 * Get the currency attribute.
	 *
	 * TODO: Remove this method once currency added on line item.
	 *
	 * @return string
	 */
	public function getCurrencyAttribute() {
		return $this->checkout->currency ?? \SureCart::account()->currency;
	}

	/**
	 * Get the display ad hoc amount attribute.
	 *
	 * @return string
	 */
	public function getAdHocAmountDisplayAttribute() {
		return empty( $this->ad_hoc_amount ) ? '' : Currency::format( $this->ad_hoc_amount, $this->currency );
	}

	/**
	 * Get the bump amount display attribute.
	 *
	 * @return string
	 */
	public function getDisplayBumpAmountAttribute() {
		return empty( $this->bump_amount ) ? '' : Currency::format( $this->bump_amount, $this->currency );
	}

	/**
	 * Get the display scratch amount attribute.
	 *
	 * @return string
	 */
	public function getDisplayScratchAmountAttribute() {
		return  empty( $this->scratch_amount ) ? '' : Currency::format( $this->scratch_amount, $this->currency );
	}

	/**
	 * Get the display tax amount attribute.
	 *
	 * @return string
	 */
	public function getDisplayTaxAmountAttribute() {
		return  empty( $this->tax_amount ) ? '' : Currency::format( $this->tax_amount, $this->currency );
	}

	/**
	 * Get the display subtotal amount attribute.
	 *
	 * @return string
	 */
	public function getDisplaySubtotalAmountAttribute() {
		return  empty( $this->subtotal_amount ) ? '' : Currency::format( $this->subtotal_amount, $this->currency );
	}

	/**
	 * Get the display total amount attribute.
	 *
	 * @return string
	 */
	public function getDisplayTotalAmountAttribute() {
		return  empty( $this->total_amount ) ? '' : Currency::format( $this->total_amount, $this->currency );
	}

	/**
	 * Get the display full amount attribute.
	 *
	 * @return string
	 */
	public function getDisplayFullAmountAttribute() {
		return  empty( $this->full_amount ) ? '' : Currency::format( $this->full_amount, $this->currency );
	}

	/**
	 * Get the display trial amount attribute.
	 *
	 * @return string
	 */
	public function getDisplayTrialAmountAttribute() {
		return  empty( $this->trial_amount ) ? '' : Currency::format( $this->trial_amount, $this->currency );
	}

	/**
	* Get the line item image.
	*/
	public function getImageAttribute() {
		// if we have a variant, use the variant image.
		// if ( ! empty( $this->variant ) && is_a( $this->variant, Variant::class ) ) {
		// return $this->variant->line_item_image;
		// }
		// if we have a product, use the product image.
		if ( isset( $this->price->product->line_item_image ) ) {
			return $this->price->product->line_item_image;
		}

		return null;
	}
}
