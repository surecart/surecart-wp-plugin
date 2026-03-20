<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasCheckout;
use SureCart\Models\Traits\HasFees;
use SureCart\Models\Traits\HasPrice;
use SureCart\Support\Currency;
use SureCart\Models\Traits\HasProduct;
use SureCart\Models\Traits\HasSwap;
/**
 * Price model
 */
class LineItem extends Model {
	use HasPrice;
	use HasCheckout;
	use HasProduct;
	use HasFees;
	use HasSwap;

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
	 * Get the variant attribute.
	 *
	 * @return string
	 */
	public function getVariantDisplayOptionsAttribute() {
		if ( empty( $this->variant_options ) ) {
			return null;
		}
		return implode( ' / ', array_filter( $this->variant_options ) );
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
	 * Swap Line Item
	 *
	 * @param string $id LineItem ID.
	 *
	 * @return $this|\WP_Error
	 */
	protected function swap( $id = null ) {
		if ( $this->fireModelEvent( 'swaping' ) === false ) {
			return $this;
		}

		$this->id = $id ? $id : $this->id;

		if ( empty( $this->id ) ) {
			return new \WP_Error( 'not_saved', 'No Line Item Id passed.' );
		}

		$swapped = \SureCart::request(
			$this->endpoint . '/' . $this->id . '/swap',
			[
				'method' => 'PATCH',
				'query'  => $this->query,
			]
		);

		if ( is_wp_error( $swapped ) ) {
			return $swapped;
		}

		$this->resetAttributes();

		$this->fill( $swapped );

		$this->fireModelEvent( 'swapped' );

		return $this;
	}

	/**
	 * Swap Line Item
	 *
	 * @param string $id LineItem ID.
	 *
	 * @return $this|\WP_Error
	 */
	protected function unswap( $id = null ) {
		if ( $this->fireModelEvent( 'unswaping' ) === false ) {
			return $this;
		}

		$this->id = $id ? $id : $this->id;

		if ( empty( $this->id ) ) {
			return new \WP_Error( 'not_saved', 'No Line Item Id passed.' );
		}

		$unswapped = \SureCart::request(
			$this->endpoint . '/' . $this->id . '/unswap',
			[
				'method' => 'PATCH',
				'query'  => $this->query,
			]
		);

		if ( is_wp_error( $unswapped ) ) {
			return $unswapped;
		}

		$this->resetAttributes();

		$this->fill( $unswapped );

		$this->fireModelEvent( 'unswapped' );

		return $this;
	}

	/**
	 * Get the is_swappable attribute.
	 *
	 * @return string
	 */
	public function getIsSwappableAttribute() {
		return ! empty( $this->swap ) || ! empty( $this->price->current_swap );
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
	public function getAdHocDisplayAmountAttribute() {
		return ! empty( $this->ad_hoc_amount ) ? Currency::format( $this->ad_hoc_amount, $this->currency ) : '';
	}

	/**
	 * Get the bump amount display attribute.
	 *
	 * @return string
	 */
	public function getBumpDisplayAmountAttribute() {
		return ! empty( $this->bump_amount ) ? Currency::format( $this->bump_amount, $this->currency ) : '';
	}

	/**
	 * Get the display scratch amount attribute.
	 *
	 * @return string
	 */
	public function getScratchDisplayAmountAttribute() {
		return ! empty( $this->scratch_amount ) ? Currency::format( $this->scratch_amount, $this->currency ) : '';
	}

	/**
	 * Get the SKU text attribute.
	 *
	 * @return string
	 */
	public function getSkuAttribute() {
		if ( ! empty( $this->variant ) && ! empty( $this->variant->sku ) ) {
			return $this->variant->sku;
		}
		return $this->price->product->sku ?? '';
	}

	/**
	 * Get the display tax amount attribute.
	 *
	 * @return string
	 */
	public function getTaxDisplayAmountAttribute() {
		return ! empty( $this->tax_amount ) ? Currency::format( $this->tax_amount, $this->currency ) : '';
	}

	/**
	 * Get the display subtotal amount attribute.
	 *
	 * @return string
	 */
	public function getSubtotalDisplayAmountAttribute() {
		return Currency::format( (int) $this->subtotal_amount, $this->currency );
	}

	/**
	 * Get the display total amount attribute.
	 *
	 * @return string
	 */
	public function getTotalDisplayAmountAttribute() {
		return Currency::format( (int) $this->total_amount, $this->currency );
	}

	/**
	 * Get the display subtotal amount + upsell discount amount attribute.
	 *
	 * @return string
	 */
	public function getSubtotalWithUpsellDiscountDisplayAmountAttribute() {
		return Currency::format( (int) $this->subtotal_with_upsell_discount_amount, $this->currency );
	}

	/**
	 * Get the subtotal amount + upsell discount amount attribute.
	 *
	 * @return string
	 */
	public function getSubtotalWithUpsellDiscountAmountAttribute() {
		if ( empty( $this->fees->data ) || ! is_array( $this->fees->data ) ) {
			return (int) $this->subtotal_amount;
		}

		$total_upsell_discount = 0;

		foreach ( $this->fees->data as $fee ) {
			if ( 'upsell' === $fee->fee_type ) {
				$total_upsell_discount += $fee->amount ?? 0;
			}
		}

		return (int) $this->subtotal_amount + (int) ( $total_upsell_discount ?? 0 );
	}

	/**
	 * Get the display full amount attribute.
	 *
	 * @return string
	 */
	public function getFullDisplayAmountAttribute() {
		return ! empty( $this->full_amount ) ? Currency::format( $this->full_amount, $this->currency ) : '';
	}

	/**
	 * Get the display trial amount attribute.
	 *
	 * @return string
	 */
	public function getTrialDisplayAmountAttribute() {
		return ! empty( $this->trial_amount ) ? Currency::format( $this->trial_amount, $this->currency ) : '';
	}

	/**
	 * Get the line item image.
	 */
	public function getImageAttribute() {
		// if we have a variant, use the variant image.
		if ( ! empty( $this->variant ) && is_a( $this->variant, Variant::class ) && ! empty( (array) $this->variant->line_item_image ) ) {
			return $this->variant->line_item_image;
		}

		// if we have a product, use the product image.
		if ( isset( $this->price->product->line_item_image ) ) {
			return $this->price->product->line_item_image;
		}

		return null;
	}

	/**
	 * Get the converted discount amount attribute.
	 *
	 * @return string
	 */
	public function getConvertedDiscountAmountAttribute() {
		if ( $this->is_zero_decimal || empty( $this->discount_amount ) ) {
			return $this->discount_amount;
		}
		return $this->discount_amount / 100;
	}

	/**
	 * Get the total default currency display amount attribute.
	 *
	 * @return string
	 */
	public function getTotalDefaultCurrencyDisplayAmountAttribute() {
		return Currency::format( (int) $this->total_amount, $this->currency, [ 'convert' => false ] );
	}

	/**
	 * Get the note display attribute by strip out HTML tags.
	 *
	 * @return string
	 */
	public function getDisplayNoteAttribute() {
		return ! empty( $this->note ) ? wp_strip_all_tags( $this->note, true ) : '';
	}

	/**
	 * Purchasable status display
	 *
	 * @return string
	 */
	public function getPurchasableStatusDisplayAttribute() {
		if ( 'purchasable' === $this->purchasable_status ) {
			return;
		}

		// translations for purchaseable status.
		$translations = array(
			'price_gone'             => __( 'No longer available', 'surecart' ),
			'price_old_version'      => __( 'Price has changed', 'surecart' ),
			'variant_missing'        => __( 'Options no longer available', 'surecart' ),
			'variant_old_version'    => __( 'Price has changed', 'surecart' ),
			'variant_gone'           => __( 'Item no longer available', 'surecart' ),
			'out_of_stock'           => __( 'Out of stock', 'surecart' ),
			'exceeds_purchase_limit' => __( 'Exceeds purchase limit', 'surecart' ),
		);

		if ( $this->quantity > 1 ) {
			$translations['out_of_stock'] = __( 'Quantity unavailable', 'surecart' );
		}

		return $translations[ $this->purchasable_status ] ?? '';
	}
}
