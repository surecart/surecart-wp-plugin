<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasDates;
use SureCart\Models\Traits\HasPrice;
use SureCart\Support\Currency;

/**
 * Holds the data of the order bump.
 */
class Bump extends Model {
	use HasDates;
	use HasPrice;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'bumps';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'bump';

	/**
	 * Get the amount off display amount attribute
	 *
	 * @return string
	 */
	protected function getAmountOffDisplayAmountAttribute() {
		return Currency::format( $this->amount_off, $this->currency );
	}

	/**
	 * Get the amount attribute
	 *
	 * @return string|null
	 */
	protected function getSubtotalDisplayAmountAttribute() {
		return $this->price->display_amount ?? null;
	}

	/**
	 * Get the amount attribute
	 *
	 * @return int|null
	 */
	protected function getSubtotalAmountAttribute() {
		return $this->price->amount ?? null;
	}

	/**
	 * Get the scratch amount attribute
	 *
	 * @return int
	 */
	protected function getTotalAmountAttribute() {
		$initial_amount = $this->price->amount ?? 0;

		if ( ! empty( $this->amount_off ) ) {
			return max( 0, $initial_amount - $this->amount_off );
		}

		if ( ! empty( $this->percent_off ) ) {
			$off = $initial_amount * ( $this->percent_off / 100 );
			return max( 0, $initial_amount - $off );
		}

		return $initial_amount;
	}

	/**
	 * Get the display amount attribute
	 *
	 * @return string
	 */
	protected function getTotalDisplayAmountAttribute() {
		return Currency::format( $this->total_amount, $this->currency );
	}

	/**
	 * Get the rendered bump description attribute.
	 *
	 * @return string
	 */
	public function getRenderedDescriptionAttribute() {
		return ! empty( $this->metadata->description ) ? wp_kses_post( wpautop( $this->metadata->description ) ) : '';
	}
}
