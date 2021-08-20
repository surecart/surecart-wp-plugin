<?php

namespace CheckoutEngine\Controllers\Rest;

use CheckoutEngine\Models\Account;

/**
 * Handle coupon requests through the REST API
 */
class AccountController extends RestController {
	/**
	 * Find account.
	 *
	 * @return Model
	 */
	public function find() {
		return Account::find();
	}

	/**
	 * Edit account
	 *
	 * @param array $params Params to update.
	 *
	 * @return Model
	 */
	public function edit( $params ) {
		return Account::update( $params );
	}
}
