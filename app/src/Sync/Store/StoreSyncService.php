<?php
namespace SureCart\Sync\Store;

/**
 * The store sync service.
 * This service is responsible for syncing the store data when
 * the account id is first set or changed.
 *
 * @since 3.0.0
 * @package SureCart\Sync\Store
 */
class StoreSyncService {
	/**
	 * Bootstrap the service.
	 *
	 * @return mixed
	 */
	public function bootstrap() {
		add_action( 'admin_init', array( $this, 'maybeStartSync' ) );
	}

	/**
	 * The option name for the stored version.
	 *
	 * @var string
	 */
	protected $option_name = 'surecart_current_account_id';

	/**
	 * Retrieves the stored version from the WordPress options.
	 *
	 * @return string The stored version.
	 */
	public function getStoredAccount() {
		return get_option( $this->option_name, null );
	}

	/**
	 * Retrieves the current plugin version.
	 *
	 * @return string The current plugin version.
	 */
	public function currentAccountId() {
		return \SureCart::account()->id ?? '';
	}

	/**
	 * Flush the rewrite rules on version change.
	 *
	 * @return boolean
	 */
	public function maybeStartSync() {
		$current_account_id = $this->currentAccountId();
		$stored_account_id = $this->getStoredAccount();

		// there is no current account id, or the stored account id is the same as the current account id.
		if ( empty( $current_account_id ) || $current_account_id === $stored_account_id) {
			return false;
		}

		return $this->startSync();
	}

	/**
	 * Flushes the rewrite rules and updates the stored version.
	 *
	 * @return boolean
	 */
	public function startSync() {
		$this->sync();
		return update_option( $this->option_name, $this->currentAccountId(), false );
	}

	/**
	 * Sync the store data.
	 *
	 * @return void
	 */
	public function sync() {
		return \SureCart::sync()->products()->dispatch( [ 'with_collections' => true ] );
	}
}
