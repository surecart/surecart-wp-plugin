<?php

namespace SureCart\Models;

/**
 * Holds the data of the current account.
 */
class Account extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'account';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'account';

	/**
	 * Does an update clear account cache?
	 *
	 * @var boolean
	 */
	protected $clears_account_cache = true;

	/**
	 * Has Checklist.
	 *
	 * @return bool
	 */
	public function getHasChecklistAttribute() {
		return ! empty( $this->onboarding_checklist->id );
	}

	/**
	 * Get the account ID.
	 *
	 * @return string
	 */
	public function getIsConnectedAttribute() {
		return ! empty( $this->id );
	}

	/**
	 * Get the onboarding checklist ID.
	 *
	 * @return object
	 */
	public function getOnboardingChecklistAttribute() {
		// no charges yet.
		if ( empty( $this->charges_usd_amount ) ) {
			return (object) [
				'title' => __( 'Getting Started', 'surecart' ),
				'id' => '680fd578155c006aea08424b',
				'sharedKey' => 'setup/' . $this->id,
			];
		}

		// less than $100 in charges.
		if ( $this->charges_usd_amount < 10000 ) {
			return (object)[
				'title' => __( 'Boost Revenue', 'surecart' ),
				'id' => '680fe7c59b227e43322c369a',
				'sharedKey' => 'boost/' . $this->id,
			];
		}

		// has charges.
		return (object) [];
	}
}
