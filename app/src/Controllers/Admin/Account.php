<?php

namespace CheckoutEngine\Controllers\Admin;

use CheckoutEngine\Models\Account as AccountModel;

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
		$account = AccountModel::find();

		return \CheckoutEngine::view( 'admin.settings.account' )->with(
			[
				'tab'      => $request->query( 'tab' ),
				'name'     => $account->name,
				'currency' => $account->currency,
			]
		);
	}
}
