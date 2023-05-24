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
		add_action(
			'in_admin_header',
			function() use ( $breadcrumbs ) {
				return \SureCart::render(
					'layouts/partials/admin-header',
					[
						'breadcrumbs'             => $breadcrumbs,
						'show_provisional_banner' => ! \SureCart::account()->claimed,
						'claim_url'               => \SureCart::account()->claim_url,
					]
				);
			}
		);
	}
}
