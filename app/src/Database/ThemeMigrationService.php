<?php

namespace SureCart\Database;

use SureCart\Models\Brand;

/**
 * One-time migration: moves surecart_theme WP option to brand.theme on the API.
 * Also copies brand.color and brand.logo to dark fields for existing dark mode users.
 */
class ThemeMigrationService extends GeneralMigration {

	/**
	 * Unique key to track this specific migration.
	 *
	 * @var string
	 */
	protected $migration_key = 'surecart_theme_to_brand_migration';

	/**
	 * Whether to prevent marking migration as complete (e.g. on API failure).
	 *
	 * @var bool
	 */
	private $prevent_complete = false;

	/**
	 * Run the migration.
	 *
	 * @return void
	 */
	protected function run() {
		$wp_theme = get_option( 'surecart_theme', 'light' );

		// Only migrate if the user had explicitly set dark theme.
		if ( 'dark' !== $wp_theme ) {
			return;
		}

		// Safety: stop retrying after 3 failed attempts.
		// Keep prevent_complete true so the migration stays pending
		// and the WP option fallback in ThemeService::mode() remains active.
		$attempts = (int) get_transient( 'sc_theme_migration_attempts' );
		if ( $attempts >= 3 ) {
			$this->prevent_complete = true;
			return;
		}
		set_transient( 'sc_theme_migration_attempts', $attempts + 1, HOUR_IN_SECONDS );

		// Check if account/brand is available.
		$brand = \SureCart::account()->brand;
		if ( empty( $brand ) || is_wp_error( $brand ) ) {
			// API unreachable — prevent complete() so it retries next load.
			$this->prevent_complete = true;
			return;
		}

		// Build the update data.
		$update_data = [];

		// Set theme to dark if not already set on the API.
		if ( 'dark' !== ( $brand->theme ?? 'light' ) ) {
			$update_data['theme'] = 'dark';
		}

		// Copy existing brand color to dark_color if dark_color is not already set.
		if ( ! empty( $brand->color ) && empty( $brand->dark_color ) ) {
			$update_data['dark_color'] = $brand->color;
		}

		// Copy existing logo to dark_logo if dark_logo is not already set.
		if ( ! empty( $brand->logo->id ) && empty( $brand->dark_logo->id ) ) {
			$update_data['dark_logo'] = $brand->logo->id;
		}

		// Nothing to update — already fully migrated.
		if ( empty( $update_data ) ) {
			delete_option( 'surecart_theme' );
			delete_transient( 'sc_theme_migration_attempts' );
			return;
		}

		$result = Brand::update( $update_data );

		if ( is_wp_error( $result ) ) {
			// API call failed — prevent complete() so it retries next load.
			$this->prevent_complete = true;
			return;
		}

		// Clean up the old WP option and retry transient now that it's migrated to the API.
		delete_option( 'surecart_theme' );
		delete_transient( 'sc_theme_migration_attempts' );
	}

	/**
	 * Only mark complete if the migration actually succeeded.
	 *
	 * @return void
	 */
	public function complete() {
		if ( $this->prevent_complete ) {
			return;
		}
		parent::complete();
	}
}
