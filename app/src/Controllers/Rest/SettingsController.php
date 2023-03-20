<?php

namespace SureCart\Controllers\Rest;

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
				'object'                   			=> 'settings',
				'api_token'                			=> ApiToken::get(),
				'uninstall'                			=> (bool) get_option( 'sc_uninstall', false ),
				'stripe_payment_element'   			=> (bool) get_option( 'sc_stripe_payment_element', false ),
				'use_esm_loader'           			=> (bool) get_option( 'surecart_use_esm_loader', false ),
				'slide_out_cart_disabled'  			=> (bool) get_option( 'sc_slide_out_cart_disabled', false ),
				'cart_menu_button_enabled' 			=> (bool) get_option( 'sc_cart_menu_button_enabled', false ),
				'cart_menu_button_always_shown' 	=> (bool) get_option( 'sc_cart_menu_button_always_shown', true ),
				'cart_flyout_menu_enabled' 			=> (bool) get_option( 'sc_cart_flyout_menu_enabled', true ),
				'cart_menu_id' 						=> get_option( 'sc_cart_menu_id' ),
				'cart_menu_button_alignment' 		=> get_option( 'sc_cart_menu_button_alignment' ),
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
			if ( ! empty( $request['api_token'] ) ) {
				$validate = $this->validate( $request->get_param( 'api_token' ) );
				if ( is_wp_error( $validate ) ) {
					return $validate;
				}
			}
			ApiToken::save( $request['api_token'] );
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

		// update menu cart button visibility.
		if ( isset( $request['cart_menu_button_enabled'] ) ) {
			update_option( 'sc_cart_menu_button_enabled', (bool) $request->get_param( 'cart_menu_button_enabled' ) );
		}

		// update menu cart button always visibility.
		if ( isset( $request['cart_menu_button_always_shown'] ) ) {
			update_option( 'sc_cart_menu_button_always_shown', (bool) $request->get_param( 'cart_menu_button_always_shown' ) );
		}

		// update menu cart flyout option.
		if ( isset( $request['cart_flyout_menu_enabled'] ) ) {
			update_option( 'sc_cart_flyout_menu_enabled', (bool) $request->get_param( 'cart_flyout_menu_enabled' ) );
		}

		// update cart button menu id.
		if ( isset( $request['cart_menu_id'] ) ) {
			update_option( 'sc_cart_menu_id', $request->get_param( 'cart_menu_id' ) );
		}

		// update menu cart alignment.
		if ( isset( $request['cart_menu_button_alignment'] ) ) {
			update_option( 'sc_cart_menu_button_alignment', $request->get_param( 'cart_menu_button_alignment' ) );
		}

		return rest_ensure_response( $this->find( $request ) );
	}

	/**
	 * Validate the token.
	 *
	 * @param string $token The API token.
	 *
	 * @return true|\WP_Error
	 */
	protected function validate( $token = '' ) {
		$response = \SureCart::requests()->setToken( $token )->get( 'account' );
		if ( is_wp_error( $response ) ) {
			return $response;
		}
		return true;
	}
}
