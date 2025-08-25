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
	 * Get the account ID.
	 *
	 * @return string
	 */
	public function getIsConnectedAttribute() {
		return ! empty( ApiToken::get() ) && ! empty( $this->id );
	}

	/**
	 * Get the claim expired attribute.
	 *
	 * @return bool
	 */
	public function getClaimExpiredAttribute() {
		return ! empty( $this->claim_window_ends_at ) && time() > $this->claim_window_ends_at;
	}
}
