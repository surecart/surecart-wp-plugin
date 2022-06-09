<?php
namespace SureCart\Account;

use SureCart\Models\Account;

/**
 * Service for plugin activation.
 */
class AccountService {
	/**
	 * Holds the global account model.
	 *
	 * @var \SureCart\Models\Account;
	 */
	protected $account = null;

	/**
	 * We get the account when the service is loaded.
	 * Since this is loaded in a service container, its
	 * cached so it only fetches once, no matter how many calls.
	 *
	 * This is also cached in a 60 second transient to prevent
	 * rate limited calls to the API.
	 *
	 * @param \SureCart\Support\Server $server The server utility to use.
	 */
	public function __construct( \SureCart\Support\Server $server ) {
		// don't cache on localhost.
		if ( $server->isLocalHost() ) {
			return $this->fetchAccount();
		}

		$this->account = get_transient( 'surecart_account' );
		if ( false === $this->account ) {
			$this->fetchAccount();
			set_transient( 'surecart_account', $this->account, 60 );
		}
	}

	/**
	 * Fetch the account.
	 *
	 * @return void
	 */
	protected function fetchAccount() {
		$this->account = Account::with( [ 'brand', 'portal_protocol', 'tax_protocol' ] )->find();
	}

	/**
	 * Clear account cache.
	 *
	 * @return boolean
	 */
	public function clearCache() {
		return delete_transient( 'surecart_account' );
	}

	/**
	 * Get the account model attribute
	 *
	 * @param string $attribute Attribute name.
	 * @return mixed
	 */
	public function __get( $attribute ) {
		return $this->account->$attribute ?? null;
	}
}
