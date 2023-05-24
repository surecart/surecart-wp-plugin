<?php

namespace SureCart\Controllers\Admin;

use SureCart\Models\Account;

abstract class AdminController {
	/**
	 * Holds the global account model.
	 *
	 * @var \SureCart\Models\Account;
	 */
	protected $account = null;

	/**
	 * The header.
	 *
	 * @return void
	 */
	public function withHeader( $breadcrumbs ) {
		$this->account = $this->fetchAccount();

		add_action(
			'in_admin_header',
			function() use ( $breadcrumbs ) {
				$is_claimed = $this->account->claimed;

				return \SureCart::render(
					'layouts/partials/admin-header',
					[
						'breadcrumbs' 				=> $breadcrumbs,
						'show_provisional_banner' 	=> ! $is_claimed,
						'claim_url' 				=> ! $is_claimed ? $this->account->claim_url : '',
					]
				);
			}
		);
	}

	/**
	 * Fetch the account.
	 *
	 * @return \SureCart\Models\Account
	 */
	protected function fetchAccount() {
		$this->account = Account::with([ ])->find();
		return $this->account;
	}
}
