<?php
namespace SureCart\Models;

use SureCart\Support\Currency;

/**
 * PlatformFee model
 */
class PlatformFee extends Model {
	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'platform_fee';

	/**
	 * Get the base display amount.
	 *
	 * @return string
	 */
	public function getBaseDisplayAmountAttribute() {
		return Currency::format( $this->base_amount, $this->currency );
	}

	/**
	 * Get the display amount for features breakdown
	 *
	 * @return array
	 */
	public function getFeaturesBreakdownAttribute() {
		$features_breakdown = (array) ( $this->attributes['features_breakdown'] ?? [] );

		return array_map(
			function ( $feature ) {
				if ( ! empty( $feature ) ) {
					$feature->display_amount = Currency::format( $feature->amount, $this->currency );
				}
				return $feature;
			},
			$features_breakdown
		);
	}
}
