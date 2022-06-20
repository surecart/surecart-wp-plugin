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
	 * The key for the cache.
	 *
	 * @var string
	 */
	protected $cache_key = 'surecart_account';

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
		$cache = defined( 'SURECART_CACHE_ACCOUNT' ) && SURECART_CACHE_ACCOUNT;

		// do not cache requests if specifically set to false.
		if ( false === $cache ) {
			return $this->fetchAccount();
		}

		// cache requests if specifically set to true.
		if ( true === $cache ) {
			return $this->fetchCachedAccount();
		}

		// don't cache on localhost if constant is not set.
		if ( $server->isLocalHost() ) {
			return $this->fetchAccount();
		}

		// cache requests if not explicitly set.
		return $this->fetchCachedAccount();
	}

	/**
	 * Fetch the cached account.
	 *
	 * @return \SureCart\Models\Account
	 */
	public function fetchCachedAccount() {
		$this->account = get_transient( $this->cache_key );
		if ( false === $this->account ) {
			$this->account = $this->fetchAccount();
			set_transient( $this->cache_key, $this->account, 60 );
		}
		return $this->account;
	}

	/**
	 * Fetch the account.
	 *
	 * @return \SureCart\Models\Account
	 */
	protected function fetchAccount() {
		$this->account = Account::with( [ 'brand', 'portal_protocol', 'tax_protocol' ] )->find();
		return $this->account;
	}

	/**
	 * Clear account cache.
	 *
	 * @return boolean
	 */
	public function clearCache() {
		return delete_transient( $this->cache_key );
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
