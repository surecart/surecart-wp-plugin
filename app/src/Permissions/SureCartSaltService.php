<?php

namespace SureCart\Permissions;

use SureCart\Permissions\WPConfig\WPConfigTransformService;

/**
 * Handles salts
 */
class SureCartSaltService {
	/**
	 * Get the path to the wp-config.php file.
	 *
	 * @return string|null
	 */
	public function getWpConfigPath() {
		// Default location within ABSPATH.
		if ( file_exists( ABSPATH . 'wp-config.php' ) ) {
			return ABSPATH . 'wp-config.php';
		}

		// One directory above ABSPATH.
		elseif ( file_exists( dirname( ABSPATH ) . '/wp-config.php' ) ) {
			return dirname( ABSPATH ) . '/wp-config.php';
		}

		// can't find it.
		return null;
	}

	/**
	 * Write the salt to the wp-config.php file.
	 *
	 * @return void
	 */
	public function write() {
		// If the wp-config.php file does not exist, return.
		if ( empty( $this->getWpConfigPath() ) ) {
			return;
		}

		// If the LOGGED_IN_KEY constant is not defined, return.
		if ( ! defined( 'LOGGED_IN_KEY' ) ) {
			return;
		}

		// If the SURECART_ENCRYPTION_KEY constant is defined, return.
		if ( defined( 'SURECART_ENCRYPTION_KEY' ) ) {
			return;
		}

		// Create the service.
		try {
			$service = new WPConfigTransformService( $this->getWpConfigPath() );

			// sanity check.
			if ( $service->exists( 'constant', 'SURECART_ENCRYPTION_KEY' ) ) {
				return;
			}

			$service->add( 'constant', 'SURECART_ENCRYPTION_KEY', LOGGED_IN_KEY );
		} catch ( \Exception $e ) {
			error_log( $e->getMessage() );
			// silently fail.
			return;
		}
	}
}
