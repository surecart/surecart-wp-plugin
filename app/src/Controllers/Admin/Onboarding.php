<?php

namespace SureCart\Controllers\Admin;

use SureCart\Models\ApiToken;
use SureCart\Models\Product;

/**
 * Handles onboarding http requests.
 */
class Onboarding {
	/**
	 * Show the onboarding page.
	 *
	 * @return string
	 */
	public function show() {
		if ( ! ApiToken::get() || is_wp_error( \SureCart::account() ) ) {
			return \SureCart::view( 'admin/onboarding/install' )->with(
				[
					'url' => esc_url(
						add_query_arg(
							[
								'onboarding' => [
									'account_name'      => get_bloginfo( 'name' ),
									'account_url'       => get_site_url(),
									'return_url'        => esc_url_raw( admin_url( 'admin.php?page=sc-complete-signup' ) ),
									'account_time_zone' => wp_timezone_string(),
								],
							],
							untrailingslashit( SURECART_APP_URL ) . '/sign_up'
						)
					),
				]
			);
		}

		// check if the token is valid.
		$account  = \SureCart::account();
		$products = Product::get();

		if ( empty( $products ) ) {
			// create a donation product for an example.
			Product::create(
				[
					'name'        => __( 'Donation', 'surecart' ),
					'recurring'   => false,
					'tax_enabled' => false,
					'prices'      => [
						[
							'ad_hoc'   => true,
							'currency' => $account->currency,
						],
					],
				]
			);
		}

		return \SureCart::view( 'admin/onboarding/show' )->with(
			[
				'docs_url'     => 'https://surecart.com',
				'settings_url' => esc_url( admin_url( 'admin.php?page=sc-settings' ) ),
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

		// get the saved token.
		$old_token = ApiToken::get();

		// save token.
		ApiToken::save( $api_token );

		// check if the token is valid.
		$account = \SureCart::account();

		if ( is_wp_error( $account ) ) {
			// save token.
			ApiToken::save( $old_token );
			wp_die( esc_html__( 'Invalid API Token', 'surecart' ) );
		}

		return \SureCart::redirect()->to( \SureCart::routeUrl( 'onboarding.show' ) );
	}
}
