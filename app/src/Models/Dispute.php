<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasCustomer;
use SureCart\Models\Traits\HasCharge;
use SureCart\Models\Traits\HasDates;
use SureCart\Support\Currency;

/**
 * Dispute model.
 */
class Dispute extends Model {
	use HasCustomer;
	use HasCharge;
	use HasDates;

	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'disputes';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'dispute';

	/**
	 * Get the display amount attribute
	 *
	 * @return string
	 */
	protected function getDisplayAmountAttribute(): string {
		return Currency::format( $this->amount, $this->currency );
	}

	/**
	 * Get external dispute link.
	 *
	 * @return string
	 */
	public function getExternalDisputeLinkAttribute(): string {
		if ( empty( $this->charge->payment_intent->processor_type ) ) {
			return '';
		}

		$links = [
			'stripe' => [
				'live' => 'https://dashboard.stripe.com/disputes/',
				'test' => 'https://dashboard.stripe.com/test/disputes/',
			],
			'paypal' => [
				'live' => 'https://www.paypal.com/disputes/',
				'test' => 'https://www.sandbox.paypal.com/disputes/',
			],
			'mollie' => [
				'live' => 'https://my.mollie.com/dashboard/chargebacks',
				'test' => 'https://my.mollie.com/dashboard/chargebacks', // same for test.
			],
		];

		$processor = $this->charge->payment_intent->processor_type;
		$mode      = $this->live_mode ? 'live' : 'test';

		switch ( $processor ) {
			case 'stripe':
				return $links[ $processor ][ $mode ] . ( $this->external_dispute_id ?? '' );

			// paypal and mollie has no specific page for dispute.
			case 'paypal':
			case 'mollie':
				return $links[ $processor ][ $mode ];

			default:
				return '';
		}
	}
}
