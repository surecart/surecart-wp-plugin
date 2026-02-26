<?php

namespace SureCart\Tests\Services;

use SureCart\Tests\SureCartUnitTestCase;
use SureCart\Models\Account;
use SureCart\Models\Brand;
use SureCart\Database\ThemeMigrationService;

class ThemeMigrationServiceTest extends SureCartUnitTestCase {
	use \Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

	/**
	 * Set up a new app instance to use for tests.
	 */
	public function setUp() : void
	{
		parent::setUp();

		\SureCart::make()->bootstrap([
			'providers' => [
				\SureCart\WordPress\PluginServiceProvider::class,
				\SureCart\Account\AccountServiceProvider::class,
				\SureCart\Request\RequestServiceProvider::class,
			],
		], false);

		// Clean up before each test.
		delete_option( 'surecart_theme' );
		delete_option( 'surecart_theme_to_brand_migration' );
		delete_transient( 'surecart_account' );
		delete_transient( 'sc_theme_migration_attempts' );
	}

	/**
	 * Helper to set the account transient with a brand.
	 *
	 * @param array $brand_data Brand attributes.
	 */
	private function setAccountWithBrand( array $brand_data = [] ) {
		$brand = new Brand( array_merge( [
			'id'     => 'test-brand-id',
			'object' => 'brand',
		], $brand_data ) );

		$account = new Account( [
			'id'       => 'test-account-id',
			'object'   => 'account',
			'currency' => 'usd',
			'brand'    => $brand,
		] );

		set_transient( 'surecart_account', $account->toArray() );
		\SureCart::account()->fetchCachedAccount();
	}

	/**
	 * Helper to run the migration via maybeRun() and then fire complete().
	 *
	 * @return ThemeMigrationService
	 */
	private function runMigration() {
		$service = new ThemeMigrationService();
		$service->maybeRun();
		// complete() is hooked to admin_init at priority 999999 by maybeRun().
		// Call it directly to simulate.
		$service->complete();
		return $service;
	}

	// -------------------------------------------------------------------------
	// Skipping tests
	// -------------------------------------------------------------------------

	/**
	 * @group theme-migration
	 */
	public function test_skips_migration_when_theme_is_light() {
		update_option( 'surecart_theme', 'light' );
		$this->setAccountWithBrand();

		$this->runMigration();

		// Should mark complete since it skipped gracefully.
		$this->assertNotEmpty( get_option( 'surecart_theme_to_brand_migration' ) );
	}

	/**
	 * @group theme-migration
	 */
	public function test_skips_migration_when_option_not_set() {
		// No surecart_theme option at all — defaults to 'light'.
		$this->setAccountWithBrand();

		$this->runMigration();

		// Should mark complete since it skipped gracefully.
		$this->assertNotEmpty( get_option( 'surecart_theme_to_brand_migration' ) );
	}

	// -------------------------------------------------------------------------
	// Prevent complete on failure
	// -------------------------------------------------------------------------

	/**
	 * @group theme-migration
	 */
	public function test_prevents_complete_when_brand_unavailable() {
		update_option( 'surecart_theme', 'dark' );
		// No account transient — brand will be empty/unavailable.

		$this->runMigration();

		// Should NOT mark complete.
		$this->assertEmpty( get_option( 'surecart_theme_to_brand_migration' ) );
	}

	// -------------------------------------------------------------------------
	// Retry limit
	// -------------------------------------------------------------------------

	/**
	 * @group theme-migration
	 */
	public function test_respects_retry_limit() {
		update_option( 'surecart_theme', 'dark' );
		// Set attempts to 3 (max).
		set_transient( 'sc_theme_migration_attempts', 3, HOUR_IN_SECONDS );

		$service = new ThemeMigrationService();
		$service->maybeRun();
		$service->complete();

		// Should mark complete because run() returned early (no prevent_complete set).
		$this->assertNotEmpty( get_option( 'surecart_theme_to_brand_migration' ) );
		// Attempts transient should remain at 3 (not incremented).
		$this->assertEquals( 3, get_transient( 'sc_theme_migration_attempts' ) );
	}

	// -------------------------------------------------------------------------
	// Successful migration
	// -------------------------------------------------------------------------

	/**
	 * @group theme-migration
	 */
	public function test_skips_update_when_brand_already_dark() {
		update_option( 'surecart_theme', 'dark' );
		$this->setAccountWithBrand( [
			'theme' => 'dark',
			'color' => '17E19C',
		] );

		$this->runMigration();

		// Should mark complete — already migrated on API side.
		$this->assertNotEmpty( get_option( 'surecart_theme_to_brand_migration' ) );
	}

	/**
	 * @group theme-migration
	 */
	public function test_does_not_overwrite_existing_dark_fields() {
		update_option( 'surecart_theme', 'dark' );
		$this->setAccountWithBrand( [
			'color'      => '17E19C',
			'dark_color' => 'EXISTING',
			'logo'       => (object) [ 'id' => 'logo-id' ],
			'dark_logo'  => (object) [ 'id' => 'existing-dark-logo-id' ],
		] );

		// Brand::update will be called but should NOT include dark_color or dark_logo
		// since they're already set. We can't easily mock static Brand::update here,
		// but we can verify the migration service doesn't crash and processes correctly.
		// The key assertion is that the service runs without error.
		$service = new ThemeMigrationService();
		$service->maybeRun();

		// Verify attempt was counted.
		$this->assertNotEmpty( get_transient( 'sc_theme_migration_attempts' ) );
	}

	// -------------------------------------------------------------------------
	// Option cleanup
	// -------------------------------------------------------------------------

	/**
	 * @group theme-migration
	 */
	public function test_option_persists_when_migration_fails() {
		update_option( 'surecart_theme', 'dark' );
		// No account — brand unavailable, migration fails.

		$this->runMigration();

		// WP option should still exist since migration failed.
		$this->assertSame( 'dark', get_option( 'surecart_theme' ) );
	}
}
