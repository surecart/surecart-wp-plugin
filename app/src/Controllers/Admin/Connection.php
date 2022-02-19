<?php

namespace CheckoutEngine\Controllers\Admin;

use CheckoutEngine\Models\ApiToken;

class Connection {
	public function show( \CheckoutEngineCore\Requests\RequestInterface $request, $view ) {
		return \CheckoutEngine::view( 'admin/connection' )->with(
			[
				'api_token' => ApiToken::get(),
				'status'    => $request->query( 'status' ),
			]
		);
	}
	public function save( \CheckoutEngineCore\Requests\RequestInterface $request, $view ) {
		$url       = $request->getHeaderLine( 'Referer' );
		$api_token = $request->body( 'api_token' );

		if ( empty( $api_token ) ) {
			return \CheckoutEngine::redirect()->to( esc_url_raw( add_query_arg( 'status', 'missing', $url ) ) );
		}

		// save token.
		ApiToken::save( $api_token );

		return \CheckoutEngine::redirect()->to( esc_url_raw( add_query_arg( 'status', 'saved', $url ) ) );
	}
}
