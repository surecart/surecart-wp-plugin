<?php

namespace SureCart\Integrations\Etch;

/**
 * Controls the Etch Builder integration.
 */
class EtchService {
	/**
	 * Bootstrap the Etch Builder integration.
	 *
	 * @return void
	 */
	public function bootstrap(): void {
		add_filter( 'sc_cart_disabled', [ $this, 'disableCartForEtchBuilder' ] );
	}

	/**
	 * Determine if we should handle the cart via Etch Builder.
	 *
	 * @return bool
	 */
	public function disableCartForEtchBuilder(): bool {
		return $this->isEtchBuilderActive();
	}

	/**
	 * Check if the Etch Builder is active.
	 *
	 * @return bool
	 */
	private function isEtchBuilderActive(): bool {
		return function_exists( 'etch_run_plugin' ) && isset( $_GET['etch'] ) && 'magic' === $_GET['etch']; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	}
}
