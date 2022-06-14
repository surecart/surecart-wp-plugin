<?php

namespace SureCart\Controllers\Admin\Settings;

use SureCart\Models\ApiToken;

/**
 * Controls the settings page.
 */
class AdvancedSettings extends BaseSettings {
	/**
	 * Script handles for pages
	 *
	 * @var array
	 */
	protected $scripts = [
		'show' => [ 'surecart/scripts/admin/advanced', 'admin/settings/advanced' ],
	];

	/**
	 * Show the page.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @return function
	 */
	// public function show( \SureCartCore\Requests\RequestInterface $request ) {
	// return \SureCart::view( 'admin/advanced' )->with(
	// [
	// 'tab'                    => $request->query( 'tab' ) ?? '',
	// 'uninstall'              => get_option( 'sc_uninstall', false ),
	// 'stripe_payment_element' => get_option( 'sc_stripe_payment_element' ),
	// 'use_esm_loader'         => get_option( 'surecart_use_esm_loader', false ),
	// 'status'                 => $request->query( 'status' ),
	// ]
	// );
	// }

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

		// update uninstall option.
		update_option( 'sc_stripe_payment_element', $request->body( 'stripe-payment-element' ) === 'on' );

		// update performance option.
		update_option( 'surecart_use_esm_loader', $request->body( 'use_esm_loader' ) === 'on' );

		return \SureCart::redirect()->to( esc_url_raw( add_query_arg( 'status', 'saved', $url ) ) );
	}
}
