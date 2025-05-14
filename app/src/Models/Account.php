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
		return ! empty( $this->gleap_checklist->gleap_id ) && ! empty( $this->is_connected );
	}

	/**
	 * Get the account ID.
	 *
	 * @return string
	 */
	public function getIsConnectedAttribute() {
		return ! empty( ApiToken::get() ) && ! empty( $this->id );
	}
}
