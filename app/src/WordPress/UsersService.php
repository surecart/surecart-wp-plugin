<?php

namespace CheckoutEngine\WordPress;

use CheckoutEngine\Models\User;

/**
 * WordPress Users service.
 */
class UsersService {
	/**
	 * Register rest related queries.
	 *
	 * @return void
	 */
	public function register_rest_queries() {
		add_filter( 'rest_user_query', [ $this, 'userMetaQuery' ], 10, 2 );
	}

	/**
	 * Allow querying by customer id in the REST API
	 *
	 * @param array            $args Query args.
	 * @param \WP_REST_Request $request Request.
	 * @return array
	 */
	public function userMetaQuery( $args, $request ) {
		$key         = User::getCustomerMetaKey();
		$customer_id = $request->get_param( $key );

		// we're only concerned about our param.
		if ( ! $customer_id ) {
			return $args;
		}

		// lets double-check our permissions in case other permissions fail.
		if ( ! current_user_can( 'edit_ce_customers' ) ) {
			return $args;
		}

		// set the meta query.
		$args['meta_key']   = $key;
		$args['meta_value'] = $customer_id;

		return $args;
	}
}
