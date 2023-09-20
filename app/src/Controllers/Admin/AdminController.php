<?php

namespace SureCart\Controllers\Admin;

abstract class AdminController {
	/**
	 * Preload API Request Paths
	 *
	 * @param array $preload_paths The preload paths.
	 *
	 * @return void
	 */
	public function preloadPaths( $preload_paths ) {
		wp_add_inline_script(
			'wp-api-fetch',
			sprintf(
				'wp.apiFetch.use( wp.apiFetch.createPreloadingMiddleware( %s ) );',
				wp_json_encode(
					array_reduce(
						$preload_paths,
						'rest_preload_api_request',
						array()
					)
				)
			),
			'after'
		);
	}

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
						'claim_url'   => ! \SureCart::account()->claimed ? \SureCart::routeUrl( 'account.claim' ) : '',
					]
				);
			}
		);
	}
}
