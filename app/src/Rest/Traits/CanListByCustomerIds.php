<?php

namespace CheckoutEngine\Rest\Traits;

use CheckoutEngine\Models\User;

trait CanListByCustomerIds {
	/**
	 * Is the current user trying to list by their own customer id only.
	 *
	 * @param \WP_REST_Request $request Full details about the request.
	 * @return boolean
	 */
	protected function isListingOwnCustomerId( $request ) {
		if ( empty( $request['customer_ids'] ) ) {
			return false;
		}

		// get the users test and live customer ids.
		$users_customer_ids = (array) User::current()->customerIds();

		// check to make sure they are not trying to list an ID that's not one of their own.
		foreach ( $request['customer_ids'] as $id ) {
			if ( ! $id || ! in_array( $id, $users_customer_ids ) ) {
				return false; // this id does not belong to the user.
			}
		}

		return true;
	}
}
