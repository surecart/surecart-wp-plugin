<?php

namespace SureCart\Database;

/**
 * Update user meta that was incorrectly saved.
 */
class CartMigrationsService extends GeneralMigration {
	/**
	 * The version to run this migration.
	 *
	 * @var string
	 */
	protected $version = '0.17.0';

	/**
	 * Run the migration.
	 *
	 * @return void
	 */
	public function run() {
		error_log( 'run' );
		// cart page is already created.
		if ( ! empty( \SureCart::pages()->get( 'cart', 'sc_cart' ) ) ) {
			error_log( 'already created' );
			return;
		}

		// get the cart post.
		\SureCart::page_seeder()->createCartPost();
	}
}
