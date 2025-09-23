<?php

namespace SureCart\Integrations\Etch;

/**
 * Controls the Etch integration.
 */
class EtchService {
	/**
	 * Bootstrap the Etch integration.
	 *
	 * @return void
	 */
	public function bootstrap(): void {
		add_action( 'init', array( $this, 'init' ), 20 );
	}

	/**
	 * Check if Etch Builder is active.
	 *
	 * @return bool
	 */
	private function isEtchBuilderActive(): bool {
		return function_exists( 'etch_run_plugin' ) && isset( $_GET['etch'] ) && 'magic' === $_GET['etch']; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	}

	/**
	 * Initialize the Etch integration.
	 *
	 * @return void
	 */
	public function init(): void {
		if ( ! $this->isEtchBuilderActive() ) {
			return;
		}

		// set the cart filter to be disabled in Etch.
		add_filter( 'sc_cart_disabled', '__return_true' );
	}
}
