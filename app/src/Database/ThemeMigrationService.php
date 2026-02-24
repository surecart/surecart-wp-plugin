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

		// Check if account/brand is available.
		$brand = \SureCart::account()->brand;
		if ( empty( $brand ) || is_wp_error( $brand ) ) {
			// API unreachable — prevent complete() so it retries next load.
			remove_action( 'admin_init', [ $this, 'complete' ], 999999 );
			return;
		}

		// If brand.theme is already 'dark', no need to update.
		if ( 'dark' === ( $brand->theme ?? 'light' ) ) {
			return;
		}

		// Build the update data: set theme to dark and copy existing values to dark fields.
		$update_data = [ 'theme' => 'dark' ];

		// Copy existing brand color to dark_color if dark_color is not already set.
		if ( ! empty( $brand->color ) && empty( $brand->dark_color ) ) {
			$update_data['dark_color'] = $brand->color;
		}

		// Copy existing logo to dark_logo if dark_logo is not already set.
		if ( ! empty( $brand->logo->id ) && empty( $brand->dark_logo->id ) ) {
			$update_data['dark_logo'] = $brand->logo->id;
		}

		$result = Brand::update( $update_data );

		if ( is_wp_error( $result ) ) {
			// API call failed — prevent complete() so it retries next load.
			remove_action( 'admin_init', [ $this, 'complete' ], 999999 );
			return;
		}
	}
}
