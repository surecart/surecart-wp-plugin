<?php

namespace SureCart\Database;

abstract class GeneralMigration {
	/**
	 * The version number when we will run the migration.
	 *
	 * @var string
	 */
	protected $version = '0.0.0';

	/**
	 * The key for the migration.
	 *
	 * @var string
	 */
	protected $migration_key = 'surecart_migration_version';

	/**
	 * Run on init.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_action( 'admin_init', [ $this, 'maybeRun' ] );
	}

	/**
	 * Maybe let's run the migration.
	 *
	 * @return void
	 */
	public function maybeRun() {
		if ( ! $this->shouldMigrate() ) {
			return;
		}

		// run the migration.
		$this->run();

		// update the migration complete on shutdown, after all migrations have run.
		add_action( 'shutdown', [ $this, 'complete' ] );
	}

	/**
	 * Should we run this migration?
	 *
	 * @return boolean
	 */
	public function shouldMigrate() {
		// we've already done this migration.
		if ( version_compare( $this->version, $this->getLastMigrationVersion(), '<' ) ) {
			error_log( $this->version );
			return false;
		}

		// we will run it if the migrated version is less than the current version of the plugin.
		return version_compare( $this->getLastMigrationVersion(), \SureCart::plugin()->version(), '<' );
	}

	/**
	 * Run the migration
	 *
	 * @return void
	 */
	protected function run() {

	}

	/**
	 * Store the current plugin version when complete.
	 *
	 * @return void
	 */
	public function complete() {
		update_option( $this->migration_key, \SureCart::plugin()->version() );
	}

	/**
	 * Get the last version there was a migration.
	 *
	 * @return string
	 */
	public function getLastMigrationVersion() {
		return get_option( $this->migration_key, '0.0.0' );
	}
}
