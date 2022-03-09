<?php

namespace CheckoutEngine\Controllers\Admin;

use CheckoutEngine\Models\ApiToken;

class Onboarding {
	public function show( \CheckoutEngineCore\Requests\RequestInterface $request, $view ) {
		if ( ! ApiToken::get() ) {
			return \CheckoutEngine::view( 'admin/onboarding/install' )->with(
				[
					'url' => esc_url_raw( untrailingslashit( CHECKOUT_ENGINE_APP_URL ) . '/sign_up?return_url=' . esc_url( admin_url( 'admin.php?page=ce-complete-signup' ) ) ),
				]
			);
		}

		return \CheckoutEngine::view( 'admin/onboarding/show' )->with(
			[
				'docs_url'     => 'https://surecart.com',
				'settings_url' => esc_url( admin_url( 'admin.php?page=ce-settings' ) ),
				'product_url'  => esc_url( \CheckoutEngine::getUrl()->edit( 'product' ) ),
				'form_url'     => esc_url( admin_url( 'post-new.php?post_type=ce_form' ) ),
			]
		);
	}

	/**
	 * Complete Step
	 *
	 * @param \CheckoutEngineCore\Requests\RequestInterface $request Request.
	 * @return function
	 */
	public function complete( \CheckoutEngineCore\Requests\RequestInterface $request ) {
		return \CheckoutEngine::view( 'admin/onboarding/complete' )->with( [ 'status' => $request->query( 'status' ) ] );
	}

	/**
	 * Save the API Token.
	 *
	 * @param \CheckoutEngineCore\Requests\RequestInterface $request Request.
	 * @return function
	 */
	public function save( \CheckoutEngineCore\Requests\RequestInterface $request ) {
		$url       = $request->getHeaderLine( 'Referer' );
		$api_token = $request->body( 'api_token' );

		if ( empty( $api_token ) ) {
			return \CheckoutEngine::redirect()->to( esc_url_raw( add_query_arg( 'status', 'missing', $url ) ) );
		}

		// save token.
		ApiToken::save( $api_token );

		return \CheckoutEngine::redirect()->to( \CheckoutEngine::routeUrl( 'onboarding.show' ) );
	}
}
