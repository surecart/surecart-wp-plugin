<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasCustomer;
use SureCart\Models\Traits\HasDates;
use SureCart\Models\Traits\HasOrder;
use SureCart\Models\Traits\HasPaymentMethod;
use SureCart\Models\Traits\HasSubscription;
use SureCart\Models\Traits\HasPaymentIntent;
use SureCart\Support\Currency;

/**
 * Subscription model
 */
class Charge extends Model {
	use HasCustomer;
	use HasOrder;
	use HasSubscription;
	use HasDates;
	use HasPaymentMethod;
	use HasPaymentIntent;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'charges';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'charge';

	/**
	 * Refund this specific charge
	 *
	 * @return \SureCart\Models\Refund
	 */
	protected function refund() {
		return new Refund( [ 'charge' => $this->id ] );
	}

	/**
	 * Get the display amount attribute.
	 *
	 * @return string
	 */
	protected function getDisplayAmountAttribute() {
		return Currency::format( $this->amount, $this->currency );
	}

	/**
	 * Get the human discount attribute.
	 *
	 * @return string
	 */
	public function getExternalChargeLinkAttribute() {
		if ( ! $this->payment_method || ! $this->payment_method->processor_type ) {
			return null;
		}

		$payment_type = $this->payment_method->processor_type;

		if ( ! in_array( $payment_type, [ 'stripe', 'paypal' ], true ) ) {
			return null;
		}

		if ( ! $this->external_charge_id ) {
			return null;
		}

		$external_charge_id = $this->external_charge_id;
		$is_live_mode       = $this->live_mode;

		if ( 'stripe' === $payment_type ) {
			return 'https://dashboard.stripe.com/' . ( ! $is_live_mode ? 'test/' : '' ) . 'charges/' . $external_charge_id;
		}
		if ( 'paypal' === $payment_type ) {
			return 'https://www.' . ( ! $is_live_mode ? 'sandbox.' : '' ) . 'paypal.com/activity/payment/' . $external_charge_id;
		}
	}
}
