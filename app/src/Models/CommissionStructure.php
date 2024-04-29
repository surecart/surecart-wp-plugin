<?php

namespace SureCart\Models;

use SureCart\Support\Currency;

/**
 * CommissionStructure modal.
 */
class CommissionStructure extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'commission_structures';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'commission_structure';

	/**
	 * Get discount amount attribute.
	 *
	 * @return string
	 */
	public function getDiscountAmountAttribute() {
		return $this->amount_commission ?
			Currency::format( $this->amount_commission, \SureCart::account()->currency ?? 'usd' )
			: $this->percent_commission . '%';
	}

	/**
	 * Get subscription commission attribute.
	 *
	 * @return string|null
	 */
	public function getSubscriptionCommissionAttribute() {
		if ( $this->recurring_commissions_enabled ) {
			$days = $this->recurring_commission_days;
			// translators: %d is the number of days.
			return sprintf( _n( '%d Day', '%d Days', $days, 'surecart' ), $days );
		}

		return null;
	}

	/**
	 * Get lifetime commission attribute.
	 *
	 * @return string|null
	 */
	public function getLifetimeCommissionAttribute() {
		if ( $this->repeat_customer_commissions_enabled ) {
			$days = $this->repeat_customer_commission_days;
			// translators: %d is the number of days.
			return sprintf( _n( '%d Day', '%d Days', $days, 'surecart' ), $days );
		}

		return null;
	}
}
