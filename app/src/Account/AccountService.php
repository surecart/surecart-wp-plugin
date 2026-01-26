<?php
namespace SureCart\Account;

use SureCart\Models\Account;
use SureCart\Models\ApiToken;

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
	 * The application instance.
	 *
	 * @var \SureCart\Application\Application
	 */
	protected $app = null;

	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		// clear account cache when account is updated.
		\add_action( 'surecart/account_updated', array( $this, 'clearCache' ) );
	}

	/**
	 * Seed the account with products and collections.
	 *
	 * @param array $products The products to seed.
	 *
	 * @return \SureCart\Models\Import|\WP_Error
	 */
	public function seed( $products = [] ) {
		return $this->app->resolve( 'surecart.account.seed' )->seed( $products );
	}

	/**
	 * We get the account when the service is loaded.
	 * Since this is loaded in a service container, its
	 * cached so it only fetches once, no matter how many calls.
	 *
	 * This is also cached in a 60 second transient to prevent
	 * rate limited calls to the API.
	 *
	 * @param \SureCart\Support\Server              $server The server utility to use.
	 * @param \SureCartCore\Application\Application $app The application instance.
	 *
	 * @return void
	 */
	public function __construct( \SureCart\Support\Server $server, \SureCartCore\Application\Application $app ) {
		$this->app = $app;

		$cache = null;

		if ( defined( 'SURECART_CACHE_ACCOUNT' ) ) {
			$cache = SURECART_CACHE_ACCOUNT;
		}

		// do not cache requests if specifically set to false.
		if ( false === $cache ) {
			$this->fetchAccount();
			return;
		}

		// cache requests if specifically set to true.
		if ( true === $cache ) {
			$this->fetchCachedAccount();
			return;
		}

		// don't cache on localhost if constant is not set.
		if ( $server->isLocalHost() ) {
			$this->fetchAccount();
			return;
		}

		// cache requests if not explicitly set.
		$this->fetchCachedAccount();
	}

	/**
	 * Fetch the cached account.
	 *
	 * @return \SureCart\Models\Account|\WP_Error|null
	 */
	public function fetchCachedAccount() {
		$this->account = $this->convertArrayToAccount( get_transient( $this->cache_key ) );

		// we don't have a cached account.
		if ( empty( $this->account ) ) {
			// fetch the account.
			$this->account = $this->fetchAccount();

			// there was an error or the account could not be fetched by other means.
			if ( is_wp_error( $this->account ) || ! ( $this->account instanceof Account ) || empty( $this->account->id ) ) {
				// get the previously working account.
				$previously_working_account = $this->convertArrayToAccount( get_option( 'sc_previous_account' ) );

				// if there was no previously working account, return the error.
				if ( empty( $previously_working_account ) || empty( $previously_working_account->id ) ) {
					// return the error.
					return $this->account;
				}

				// set previously working account and don't try for 5 minutes.
				set_transient( $this->cache_key, $previously_working_account->toArray(), 5 * MINUTE_IN_SECONDS );

				// return the account.
				return $previously_working_account;
			}

			// store the previously working account in case we need a fallback.
			update_option( 'sc_previous_account', $this->account->toArray() );

			// set the transient.
			set_transient( $this->cache_key, $this->account->toArray(), 15 * MINUTE_IN_SECONDS );
		}

		return $this->account;
	}

	/**
	 * Fetch the account.
	 *
	 * @return \SureCart\Models\Account
	 */
	protected function fetchAccount() {
		$this->account = Account::with( array( 'brand', 'brand.address', 'customer_portal_protocol', 'tax_protocol', 'tax_protocol.address', 'subscription_protocol', 'shipping_protocol', 'affiliation_protocol' ) )->find();
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
	 * Is the account connected?
	 *
	 * @return boolean
	 */
	public function isConnected() {
		return ! empty( ApiToken::get() );
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

	/**
	 * Convert an associative array back to an Account model.
	 *
	 * @param array $data Associative array.
	 * @return \SureCart\Models\Account|null
	 */
	public function convertArrayToAccount( $data ) {
		// Handle Backward Compatibility. If it's already an account, return it.
		if ( $data instanceof Account ) {
			return $data;
		}

		if ( empty( $data ) || ( ! isset( $data['id'] ) && ! isset( $data->id ) ) ) {
			return null;
		}

		$data = json_decode( wp_json_encode( $data ) );

		return new Account( $data );
	}
}
