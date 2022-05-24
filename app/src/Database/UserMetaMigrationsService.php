<?php

namespace SureCart\Database;

/**
 * Update user meta that was incorrectly saved.
 */
class UserMetaMigrationsService extends GeneralMigration {
	/**
	 * Run the migration.
	 *
	 * @return void
	 */
	public function run() {
		$customers = get_users(
			array(
				'meta_key' => 'sc_customer_ids',
			)
		);

		// we don't have customers.
		if ( empty( $customers ) ) {
			return;
		}

		// updating will re-sanitize these values that were incorrectly sanitized.
		foreach ( $customers as $customer ) {
			update_user_meta( $customer->ID, 'sc_customer_ids', $customer->sc_customer_ids );
		}
	}
}
