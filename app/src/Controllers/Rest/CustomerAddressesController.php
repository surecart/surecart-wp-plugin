<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\User;

/**
 * Handle customer address requests through the REST API.
 *
 * Returns shipping and billing address data for the currently
 * logged-in user's customer profile.
 */
class CustomerAddressesController extends RestController {
	/**
	 * Get the customer's shipping and billing addresses.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return array|\WP_Error Returns address data on success, or WP_Error on failure.
	 */
	public function getAddresses( \WP_REST_Request $request ) {
		$mode = $request->get_param( 'mode' ) ?? 'live';
		$user = User::current();

		$customer_id = $user->customerId( $mode );

		if ( empty( $customer_id ) ) {
			return [
				'shipping_address' => [],
				'billing_address'  => [],
				'first_name'       => '',
				'last_name'        => '',
				'phone'            => '',
			];
		}

		$customer = $user->customer( $mode, [ 'shipping_address', 'billing_address' ] );

		if ( ! $customer || is_wp_error( $customer ) ) {
			return [
				'shipping_address' => [],
				'billing_address'  => [],
				'first_name'       => '',
				'last_name'        => '',
				'phone'            => '',
			];
		}

		return [
			'shipping_address' => $customer->shipping_address ?? [],
			'billing_address'  => $customer->billing_address ?? [],
			'first_name'       => $customer->first_name ?? '',
			'last_name'        => $customer->last_name ?? '',
			'phone'            => $customer->phone ?? '',
		];
	}
}
