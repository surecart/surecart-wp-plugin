<?php

namespace SureCart\Controllers\Admin;

use SureCart\Models\ApiToken;
use SureCart\Models\Account;

class Onboarding {
	public function show( \SureCartCore\Requests\RequestInterface $request, $view ) {
		if ( ! ApiToken::get() || is_wp_error( Account::find() ) ) {
			return \SureCart::view( 'admin/onboarding/install' )->with(
				[
					'url' => esc_url_raw( untrailingslashit( SURECART_APP_URL ) . '/sign_up?return_url=' . esc_url( admin_url( 'admin.php?page=ce-complete-signup' ) ) ),
				]
			);
		}

		return \SureCart::view( 'admin/onboarding/show' )->with(
			[
				'docs_url'     => 'https://surecart.com',
				'settings_url' => esc_url( admin_url( 'admin.php?page=ce-settings' ) ),
				'product_url'  => esc_url( \SureCart::getUrl()->edit( 'product' ) ),
				'form_url'     => esc_url( admin_url( 'post-new.php?post_type=sc_form' ) ),
			]
		);
	}

	/**
	 * Complete Step
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @return function
	 */
	public function complete( \SureCartCore\Requests\RequestInterface $request ) {
		return \SureCart::view( 'admin/onboarding/complete' )->with( [ 'status' => $request->query( 'status' ) ] );
	}

	/**
	 * Save the API Token.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @return function
	 */
	public function save( \SureCartCore\Requests\RequestInterface $request ) {
		$url       = $request->getHeaderLine( 'Referer' );
		$api_token = $request->body( 'api_token' );

		if ( empty( $api_token ) ) {
			return \SureCart::redirect()->to( esc_url_raw( add_query_arg( 'status', 'missing', $url ) ) );
		}

		// save token.
		ApiToken::save( $api_token );

		return \SureCart::redirect()->to( \SureCart::routeUrl( 'onboarding.show' ) );
	}
}
