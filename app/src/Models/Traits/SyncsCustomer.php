<?php

namespace SureCart\Models\Traits;

use SureCart\Models\Subscription;

/**
 * If the model has an attached customer.
 */
trait SyncsCustomer {
	/**
	 * Should we sync?
	 *
	 * @var boolean
	 */
	protected $should_sync = false;

	/**
	 * Should we sync the user to a customer?
	 *
	 * @return boolean
	 */
	protected function shouldSyncCustomer() {
		if ( ! $this->should_sync ) {
			return false;
		}
		return get_option( 'surecart_auto_sync_user_to_customer', false );
	}

	/**
	 * Enable syncing.
	 *
	 * @return this
	 */
	protected function sync( $sync = true ) {
		$this->should_sync = $sync;
		return $this;
	}
}
