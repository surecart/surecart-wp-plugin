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
		if ( empty( $this->processor_type ) ) {
			return '';
		}

		$links = [
			'stripe'   => [
				'live' => 'https://dashboard.stripe.com/disputes/',
				'test' => 'https://dashboard.stripe.com/test/disputes/',
			],
			'paypal'   => [
				'live' => 'https://www.paypal.com/disputes/',
				'test' => 'https://www.sandbox.paypal.com/disputes/',
			],
			'mollie'   => [
				'live' => 'https://my.mollie.com/dashboard/chargebacks/',
				'test' => 'https://my.mollie.com/dashboard/chargebacks/', // same for test.
			],
			'paystack' => [
				'live' => 'https://dashboard.paystack.com/#/disputes',
				'test' => 'https://dashboard.paystack.com/#/disputes', // same for test.
			],
		];

		$mode = $this->live_mode ? 'live' : 'test';

		switch ( $this->processor_type ) {
			case 'stripe':
				return $links[ $this->processor_type ][ $mode ] . ( $this->external_dispute_id ?? '' );

			// These don't support specific page for the dispute.
			case 'paypal':
			case 'mollie':
			case 'paystack':
				return $links[ $this->processor_type ][ $mode ];

			default:
				return '';
		}
	}

	/**
	 * Get the display status attribute.
	 *
	 * @return string
	 */
	public function getStatusDisplayAttribute(): string {
		return sprintf(
			/* translators: %s: dispute status */
			__( 'Dispute %s', 'surecart' ),
			$this->status ? ucfirst( $this->status ) : __( 'Unknown', 'surecart' )
		);
	}

	/**
	 * Get the display status attribute.
	 *
	 * @return string
	 */
	public function getStatusTypeAttribute() {
		$types = [
			'pending' => 'warning',
			'lost'    => 'danger',
		];
		return $types[ $this->status ] ?? 'warning';
	}
}
