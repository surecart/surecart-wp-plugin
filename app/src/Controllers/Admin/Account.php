<?php

namespace CheckoutEngine\Controllers\Admin;

/**
 * Handles account actions.
 */
class Account {

	/**
	 * Show the account page.
	 *
	 * @param \WPEmerge\Requests\RequestInterface $request Request.
	 *
	 * @return mixed
	 */
	public function show( \WPEmerge\Requests\RequestInterface $request ) {
		return \CheckoutEngine::view( 'admin.settings.account' )->with(
			[
				'tab' => $request->query( 'tab' ),
			]
		);
	}
}
