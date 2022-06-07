<?php

namespace SureCart\Controllers\Admin;

abstract class AdminController {
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
						'breadcrumbs' => $breadcrumbs,
					]
				);
			}
		);
	}
}
