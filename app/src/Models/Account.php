<?php

namespace CheckoutEngine\Models;

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
	 * Get processors.
	 *
	 * This is cached for performance reasons.
	 *
	 * @return array
	 */
	public static function processors() {
		$key        = 'checkout_engine_account_processors';
		$processors = get_transient( $key );

		if ( false === $processors ) {
			$account    = ( new static() )->find();
			$processors = $account->processors;
			// store for 60 days.
			set_transient( $key, $processors, 60 * DAY_IN_SECONDS );
		}

		return $processors;
	}
}
