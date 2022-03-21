<?php
namespace CheckoutEngine\Account;

use CheckoutEngine\Models\Account;

/**
 * Service for plugin activation.
 */
class AccountService {
	/**
	 * Holds the global account model.
	 *
	 * @var \CheckoutEngine\Models\Account;
	 */
	protected $account = null;

	/**
	 * We get the account when the service is loaded.
	 * Since this is loaded in a service container, its
	 * cached so it only fetches once, no matter how many calls.
	 */
	public function __construct() {
		$this->account = Account::with( [ 'brand', 'portal_protocol' ] )->find();
	}

	/**
	 * Get the account model attribute
	 *
	 * @param string $attribute Attribute name.
	 * @return mixed
	 */
	public function __get( $attribute ) {
		return $this->account->$attribute;
	}
}
