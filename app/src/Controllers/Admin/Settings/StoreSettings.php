<?php

namespace SureCart\Controllers\Admin\Settings;

/**
 * Controls the settings page.
 */
class StoreSettings extends BaseSettings {
	/**
	 * Show the page.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @return function
	 */
	public function show( \SureCartCore\Requests\RequestInterface $request ) {
		add_action( 'admin_enqueue_scripts', [ $this, 'showScripts' ] );

		return \SureCart::view( 'admin/store' )->with(
			[
				'tab'    => $request->query( 'tab' ) ?? '',
				'status' => $request->query( 'status' ),
			]
		);
	}

	public function showScripts() {
		$this->enqueue( 'surecart/scripts/admin/store', 'admin/settings/store' );
	}
}
