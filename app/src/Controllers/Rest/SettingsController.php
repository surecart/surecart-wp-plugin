<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Account;
use SureCart\Models\ApiToken;

/**
 * Handle price requests through the REST API
 */
class SettingsController {
	/**
	 * Index
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function find( \WP_REST_Request $request ) {
		return rest_ensure_response(
			[
				'object'                  => 'settings',
				'api_token'               => ApiToken::get(),
				'uninstall'               => (bool) get_option( 'sc_uninstall', false ),
				'stripe_payment_element'  => (bool) get_option( 'sc_stripe_payment_element', false ),
				'use_esm_loader'          => (bool) get_option( 'surecart_use_esm_loader', false ),
				'slide_out_cart_disabled' => (bool) get_option( 'sc_slide_out_cart_disabled', false ),
			]
		);
	}

	/**
	 * Update
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function edit( \WP_REST_Request $request ) {
		// save api token.
		if ( isset( $request['api_token'] ) ) {
			\SureCart::account()->clearCache();
			ApiToken::save( $request['api_token'] );
			if ( ! empty( $request['api_token'] ) ) {
				$test = Account::find();
				if ( is_wp_error( $test ) ) {
					return rest_ensure_response( $test );
				}
			}
		}

		// update uninstall option.
		if ( isset( $request['uninstall'] ) ) {
			update_option( 'sc_uninstall', $request->get_param( 'uninstall' ) );
		}

		// update uninstall option.
		if ( isset( $request['stripe_payment_element'] ) ) {
			update_option( 'sc_stripe_payment_element', $request->get_param( 'stripe_payment_element' ) );
		}

		// update performance option.
		if ( isset( $request['use_esm_loader'] ) ) {
			update_option( 'surecart_use_esm_loader', $request->get_param( 'use_esm_loader' ) );
		}

		// update slide out cart option.
		if ( isset( $request['slide_out_cart_disabled'] ) ) {
			update_option( 'sc_slide_out_cart_disabled', (bool) $request->get_param( 'slide_out_cart_disabled' ) );
		}

		return rest_ensure_response( $this->find( $request ) );
	}
}
