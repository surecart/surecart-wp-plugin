<?php

namespace SureCart\Database;

use SureCartCore\ServiceProviders\ServiceProviderInterface;

/**
 * This service provider runs on every single update.
 */
class UpdateMigrationServiceProvider implements ServiceProviderInterface {
	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function register( $container ) {
		// nothing to register.
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param  \Pimple\Container $container Service Container.
	 */
	public function bootstrap( $container ) {
		// only run the migration if the version changes.
		if ( $this->versionChanged() ) {
			add_action( 'admin_init', [ $this, 'run' ] );
		}

		// update the migration version on shutdown, after all migrations have run.
		add_action( 'shutdown', [ $this, 'updateMigrationVersion' ] );
	}

	/**
	 * Run the migration.
	 */
	public function run() {
		// flush roles on every update.
		\SureCart::plugin()->roles()->create();
	}

	/**
	 * Update the migration version.
	 *
	 * @return void
	 */
	public function updateMigrationVersion() {
		if ( $this->versionChanged() ) {
			update_option( 'surecart_migration_version', \SureCart::plugin()->version() );
		}
	}

	/**
	 * Version has changed?
	 *
	 * @return boolean
	 */
	public function versionChanged() {
		return \SureCart::plugin()->version() !== get_option( 'surecart_migration_version', '0.0.0' );
	}
}
