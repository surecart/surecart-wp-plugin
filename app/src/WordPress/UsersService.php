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
		add_filter( 'rest_user_query', [ $this, 'isCustomerQuery' ], 10, 2 );
		add_filter( 'rest_user_collection_params', [ $this, 'collectionParams' ] );
		$this->registerMeta();
	}

	/**
	 * Add our query parameters to the rest api.
	 *
	 * @param array $query_params The query parameters.
	 * @return array
	 */
	public function collectionParams( $query_params ) {
		$query_params['is_customer']    = [
			'description' => __( 'Limit result set to users with a customer.', 'checkout-engine' ),
			'type'        => 'boolean',
		];
		$query_params['ce_customer_id'] = [
			'description' => __( 'Limit result set to users with a customer.', 'checkout-engine' ),
			'type'        => 'string',
		];
		return $query_params;
	}

	/**
	 * Register customer id meta.
	 *
	 * @return void
	 */
	public function registerMeta() {
		register_meta(
			'user',
			'ce_customer_id',
			[
				'show_in_rest'      => true,
				'type'              => 'string',
				'single'            => true,
				'sanitize_callback' => 'sanitize_text_field',
				'auth_callback'     => function () {
					return current_user_can( 'edit_ce_customers' );
				},
			]
		);
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

	/**
	 * Query only users who are customers or not.
	 *
	 * @param array            $args Query args.
	 * @param \WP_REST_Request $request Request.
	 * @return array
	 */
	public function isCustomerQuery( $args, $request ) {
		$is_customer = $request->get_param( 'is_customer' );
		if ( null === $is_customer ) {
			return $args;
		}

		if ( $is_customer ) {
			// exists and not empty.
			$args['meta_query'] = [
				'relation' => 'AND',
				array(
					'key'     => User::getCustomerMetaKey(),
					'compare' => 'EXISTS',
				),
				array(
					'key'     => User::getCustomerMetaKey(),
					'value'   => '',
					'compare' => '!=',
				),
			];
		} else {
			$args['meta_query'] = [
				'relation' => 'OR',
				array(
					'key'     => User::getCustomerMetaKey(),
					'compare' => 'NOT EXISTS',
				),
				array(
					'key'     => User::getCustomerMetaKey(),
					'value'   => '',
					'compare' => '=',
				),
			];
		}

		return $args;
	}
}
