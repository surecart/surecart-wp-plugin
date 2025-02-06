<?php

namespace SureCart\Controllers\Admin\Settings;

/**
 * Controls the settings page.
 */
class DisplayCurrencySettings extends BaseSettings {
	/**
	 * Script handles for pages
	 *
	 * @var array
	 */
	protected $scripts = [
		'show' => [ 'surecart/scripts/admin/display-currency', 'admin/settings/display-currency' ],
	];

	/**
	 * Show the page.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @return function
	 */
	public function show( \SureCartCore\Requests\RequestInterface $request ) {
		// load the data views styles.
		wp_enqueue_style( 'surecart-admin-display-currency', trailingslashit( \SureCart::core()->assets()->getUrl() ) . 'dist/admin/settings/style-display-currency.css', [], \SureCart::plugin()->version() );

		// show the view.
		return parent::show( $request );
	}
}
