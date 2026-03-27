<?php

namespace SureCart\Controllers\Admin\Settings;

/**
 * Controls the settings page.
 */
class CacheSettings {
	/**
	 * Show the page.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @return function
	 */
	public function clear( \SureCartCore\Requests\RequestInterface $request ) {
		global $wpdb;
		$url = wp_get_referer();

		// Delete surecart account transient.
		delete_transient( 'surecart_account' );

		// Delete all transients with sc_remote_request_ prefix.
		$wpdb->query(
			$wpdb->prepare(
				"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
				'_transient_sc_remote_request_%',
				'_transient_timeout_sc_remote_request_%'
			)
		);

		return \SureCart::redirect()->to( esc_url_raw( add_query_arg( 'status', 'cache_cleared', $url ) ) );
	}
}
