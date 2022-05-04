<?php

namespace SureCart\Controllers\Admin\Settings;

/**
 * Controls the settings page.
 */
class ProcessorsSettings {
	/**
	 * Show the page.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @return function
	 */
	public function show( \SureCartCore\Requests\RequestInterface $request ) {
		$processors = [];
		foreach ( \SureCart::account()->processors ?? [] as $processor ) {
			$processors[ $processor->processor_type . '_' . ( $processor->live_mode ? 'live' : 'test' ) ] = $processor;
		}

		return \SureCart::view( 'admin/processors' )->with(
			[
				'tab'        => $request->query( 'tab' ) ?? '',
				'status'     => '',
				'processors' => (object) $processors,
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
		$url = $request->getHeaderLine( 'Referer' );

		// update uninstall option.
		update_option( 'sc_uninstall', $request->body( 'uninstall' ) === 'on' );

		// update performance option.
		update_option( 'surecart_use_esm_loader', $request->body( 'use_esm_loader' ) === 'on' );

		return \SureCart::redirect()->to( esc_url_raw( add_query_arg( 'status', 'saved', $url ) ) );
	}
}
