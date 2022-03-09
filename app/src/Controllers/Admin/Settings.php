<?php

namespace CheckoutEngine\Controllers\Admin;

use CheckoutEngine\Models\Account;
use CheckoutEngine\Models\AccountPortalSession;

/**
 * Controls the settings page.
 */
class Settings {
	/**
	 * Show the settings page.
	 *
	 * @return function
	 */
	public function show() {
		$session = AccountPortalSession::create(
			[
				'frame_url' => ( is_ssl() ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST'],
			]
		);

		if ( ! $session || is_wp_error( $session ) ) {
			wp_die( esc_html__( 'Could not load settings page.', 'checkout-engine' ) );
		}

		return \CheckoutEngine::view( 'admin/settings' )->with(
			[
				'session_url' => $session->url,
			]
		);
	}
}
