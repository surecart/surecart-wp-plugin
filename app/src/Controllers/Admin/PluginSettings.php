<?php

namespace SureCart\Controllers\Admin;

use SureCart\Models\ApiToken;

/**
 * Handles the plugin settings page.
 */
class PluginSettings {
	/**
	 * Show the page.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @return function
	 */
	public function show( \SureCartCore\Requests\RequestInterface $request ) {
		return \SureCart::view( 'admin/plugin' )->with(
			[
				'api_token' => ApiToken::get(),
				'uninstall' => get_option( 'ce_uninstall', false ),
				'status'    => $request->query( 'status' ),
			]
		);
	}

	/**
	 * Save the page.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @return function
	 */
	public function save( \SureCartCore\Requests\RequestInterface $request ) {
		$url       = $request->getHeaderLine( 'Referer' );
		$api_token = $request->body( 'api_token' );

		if ( empty( $api_token ) ) {
			return \SureCart::redirect()->to( esc_url_raw( add_query_arg( 'status', 'missing', $url ) ) );
		}

		// update uninstall option.
		update_option( 'ce_uninstall', $request->body( 'uninstall' ) === 'on' );

		// save token.
		ApiToken::save( $api_token );

		return \SureCart::redirect()->to( esc_url_raw( add_query_arg( 'status', 'saved', $url ) ) );
	}
}
