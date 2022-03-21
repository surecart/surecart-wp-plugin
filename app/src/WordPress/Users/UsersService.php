<?php

namespace SureCart\WordPress\Users;

use SureCart\Models\Order;
use SureCart\Models\User;

/**
 * WordPress Users service.
 */
class UsersService {
	/**
	 * Register rest related queries.
	 *
	 * @return void
	 */
	public function bootstrap() {
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
		$query_params['is_customer']     = [
			'description' => __( 'Limit result set to users with a customer.', 'surecart' ),
			'type'        => 'boolean',
		];
		$query_params['ce_customer_ids'] = [
			'description' => __( 'Limit result set to users with specific customer ids.', 'surecart' ),
			'type'        => 'array',
			'items'       => [
				'type' => 'string',
			],
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
			'ce_customer_ids',
			[
				'type'              => 'object',
				'show_in_rest'      => [
					'schema' => [
						'type'       => 'object',
						'properties' => [
							'live' => [
								'type' => 'string',
							],
							'test' => [
								'type' => 'string',
							],
						],
					],
				],
				'single'            => true,
				'sanitize_callback' => function( $value ) {
					return (object) array_map( 'sanitize_text_field', (array) $value );
				},
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
		$key          = User::getCustomerMetaKey();
		$customer_ids = $request->get_param( 'ce_customer_ids' );

		// we're only concerned about our param.
		if ( empty( $customer_ids ) ) {
			return $args;
		}

		// lets double-check our permissions in case other permissions fail.
		if ( ! current_user_can( 'edit_ce_customers' ) ) {
			return $args;
		}

		// set the meta query.
		$args['meta_query'] = [
			'relation' => 'OR',
		];

		foreach ( $customer_ids as $customer_id ) {
			$args['meta_query'][] = [
				'key'     => $key,
				'value'   => $customer_id,
				'compare' => 'LIKE',
			];
		}

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
