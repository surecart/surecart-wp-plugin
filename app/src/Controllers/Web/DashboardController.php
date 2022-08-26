<?php

namespace SureCart\Controllers\Web;

use SureCart\Models\CustomerLink;

/**
 * Thank you routes
 */
class DashboardController {
	/**
	 * Show the dashboard.
	 */
	public function show( $request, $view ) {
		// do not cache.
		$request->noCache();
		return \SureCart::view( $view );
	}

	/**
	 * Get the link from the request.
	 *
	 * @param string $link_id The link id.
	 * @return string|\WP_Error
	 */
	public function getLink( $link_id ) {
		$link = CustomerLink::find( $link_id );
		if ( is_wp_error( $link ) ) {
			return $link;
		}
		return $link;
	}

	/**
	 * Login the user
	 *
	 * @param int|\WP_User $wp_user WordPress user.
	 * @return void
	 */
	public function loginUser( $wp_user ) {
		if ( ! $wp_user ) {
			return wp_die( esc_html__( 'This user could not be found.', 'surecart' ) );
		}

		$id = ! empty( $wp_user->ID ) ? $wp_user->ID : $wp_user;
		if ( ! is_int( $id ) ) {
			return;
		}

		wp_clear_auth_cookie();
		wp_set_current_user( $id );
		wp_set_auth_cookie( $id );
	}
}
