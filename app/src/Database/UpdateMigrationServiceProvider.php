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
		add_action( 'admin_init', [ $this, 'run' ] );
		// update the migration version on admin_init lower priority, after all migrations have run.
		add_action( 'admin_init', [ $this, 'updateMigrationVersion' ], 9999999 );
	}

	/**
	 * Run the migration.
	 */
	public function run() {
		if ( ! $this->versionChanged() ) {
			return;
		}

		// flush roles on every update.
		\SureCart::plugin()->roles()->create();
	}

	/**
	 * Update the migration version.
	 *
	 * @return void
	 */
	public function updateMigrationVersion() {
		if ( ! $this->versionChanged() ) {
			return;
		}
		update_option( 'surecart_migration_version', \SureCart::plugin()->version() );
	}

	/**
	 * Version has changed?
	 *
	 * @return boolean
	 */
	public function versionChanged() {
		return version_compare( \SureCart::plugin()->version(), get_option( 'surecart_migration_version', '0.0.0' ), '!=' );
	}
}
