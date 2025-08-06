<?php

namespace SureCart\Models;

use SureCart\Models\Traits\HasCustomer;
use SureCart\Models\Traits\HasCharge;
use SureCart\Models\Traits\HasDates;

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
	 * Get external dispute link.
	 *
	 * @return string
	 */
	public function getExternalDisputeLinkAttribute(): string {
		if ( empty( $this->external_dispute_id ) ) {
			return '';
		}

		// For now, we're using only Stripe disputes.
		$base_url = $this->live_mode ? 'https://dashboard.stripe.com/disputes/' : 'https://dashboard.stripe.com/test/disputes/';
		return $base_url . $this->external_dispute_id;
	}
}
