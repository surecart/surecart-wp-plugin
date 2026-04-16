<?php

namespace SureCart\Controllers\Admin\Settings;

/**
 * Handles the Advanced settings form submission.
 */
class AdvancedSettings {
	/**
	 * Save the advanced settings.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @return function
	 */
	public function save( \SureCartCore\Requests\RequestInterface $request ) {
		$url = $request->getHeaderLine( 'Referer' );

		// update uninstall option.
		update_option( 'sc_uninstall', $request->body( 'uninstall' ) === 'on' );

		// update stripe payment element option.
		update_option( 'sc_stripe_payment_element', $request->body( 'stripe-payment-element' ) !== 'off' );

		// update load blocks styles on demand option.
		update_option( 'surecart_load_block_assets_on_demand', $request->body( 'load_block_assets_on_demand' ) === 'on' );

		// update performance option.
		update_option( 'surecart_use_esm_loader', $request->body( 'use_esm_loader' ) === 'on' );

		return \SureCart::redirect()->to( esc_url_raw( add_query_arg( 'status', 'saved', $url ) ) );
	}
}
