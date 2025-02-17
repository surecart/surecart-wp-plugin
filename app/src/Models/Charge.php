<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasCustomer;
use SureCart\Models\Traits\HasDates;
use SureCart\Models\Traits\HasOrder;
use SureCart\Models\Traits\HasPaymentMethod;
use SureCart\Models\Traits\HasSubscription;
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
	public function getAmountDisplayAmountAttribute() {
		return Currency::format( $this->amount, $this->currency );
	}

	/**
	 * Get the refunded display amount attribute.
	 *
	 * @return string
	 */
	public function getRefundedDisplayAmountAttribute() {
		return Currency::format( $this->refunded_amount, $this->currency );
	}
}
