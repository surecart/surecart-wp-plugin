<?php

namespace SureCart\Rest;

use SureCart\Rest\RestServiceInterface;
use SureCart\Controllers\Rest\BatchesController;

/**
 * Batches REST service provider.
 */
class BatchesRestServiceProvider extends RestServiceProvider implements RestServiceInterface {
	/**
	 * Endpoint.
	 *
	 * @var string
	 */
	protected $endpoint = 'batches';

	/**
	 * Rest Controller.
	 *
	 * @var string
	 */
	protected $controller = BatchesController::class;

	/**
	 * Batches are append-only — submit, then poll for status.
	 *
	 * @var array
	 */
	protected $methods = [ 'index', 'create', 'find' ];

	/**
	 * Schema callback.
	 *
	 * @return array
	 */
	public function get_item_schema() {
		if ( $this->schema ) {
			return $this->schema;
		}

		$this->schema = [
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => $this->endpoint,
			'type'       => 'object',
			'properties' => [
				'id'                              => [
					'description' => __( 'UUID of the batch.', 'surecart' ),
					'type'        => 'string',
					'context'     => [ 'view', 'edit', 'embed' ],
					'readonly'    => true,
				],
				'status'                          => [
					'description' => __( 'pending | in_progress | completed', 'surecart' ),
					'type'        => 'string',
					'readonly'    => true,
				],
				'batch_operations_count'          => [
					'description' => __( 'Total operations in this batch.', 'surecart' ),
					'type'        => 'integer',
					'readonly'    => true,
				],
				'finished_batch_operations_count' => [
					'description' => __( 'Operations that have finished (completed, failed, or timed out).', 'surecart' ),
					'type'        => 'integer',
					'readonly'    => true,
				],
				'batch_operations'                => [
					'description' => __( 'Operations to execute as part of this batch.', 'surecart' ),
					'type'        => 'array',
					'items'       => [
						'type'       => 'object',
						'properties' => [
							'http_method' => [ 'type' => 'string' ],
							'path'        => [ 'type' => 'string' ],
							'body'        => [ 'type' => 'object' ],
						],
					],
				],
			],
		];

		return $this->schema;
	}

	/**
	 * Collection params.
	 *
	 * @return array
	 */
	public function get_collection_params() {
		return [
			'page'     => [
				'description' => __( 'Page of items returned.', 'surecart' ),
				'type'        => 'integer',
			],
			'per_page' => [
				'description' => __( 'Items per page (1-100).', 'surecart' ),
				'type'        => 'integer',
			],
		];
	}

	/**
	 * Resource segment → capability suffix. New resources must be listed here
	 * before they can be batched; unknown paths are rejected.
	 *
	 * @var array<string, string>
	 */
	private const RESOURCE_CAP_SUFFIX = [
		'products'            => 'sc_products',
		'product_collections' => 'sc_products',
		'product_groups'      => 'sc_products',
		'prices'              => 'sc_prices',
		'reviews'             => 'sc_reviews',
		'orders'              => 'sc_orders',
		'customers'           => 'sc_customers',
		'subscriptions'       => 'sc_subscriptions',
		'invoices'            => 'sc_invoices',
		'coupons'             => 'sc_coupons',
		'promotions'          => 'sc_promotions',
		'affiliations'        => 'sc_affiliates',
		'licenses'            => 'sc_licenses',
		'webhooks'            => 'sc_webhooks',
		'medias'              => 'sc_medias',
	];

	public function get_items_permissions_check( $request ) {
		return $this->userCanUseBatches();
	}

	public function get_item_permissions_check( $request ) {
		return $this->userCanUseBatches();
	}

	/**
	 * Validates every operation against the cap the caller would have needed
	 * to perform it directly — otherwise a user with `edit_sc_products` could
	 * smuggle `DELETE /v1/customers/{id}` through the batch proxy.
	 */
	public function create_item_permissions_check( $request ) {
		if ( ! $this->userCanUseBatches() ) {
			return new \WP_Error(
				'rest_forbidden',
				__( 'You are not allowed to use the batch endpoint.', 'surecart' ),
				[ 'status' => 403 ]
			);
		}

		$operations = $request->get_param( 'batch_operations' );
		if ( empty( $operations ) || ! is_array( $operations ) ) {
			return new \WP_Error(
				'rest_invalid_param',
				__( 'A batch must contain at least one operation.', 'surecart' ),
				[ 'status' => 400 ]
			);
		}

		foreach ( $operations as $op ) {
			$cap = $this->requiredCapabilityFor(
				$op['http_method'] ?? '',
				$op['path'] ?? ''
			);
			if ( ! $cap ) {
				return new \WP_Error(
					'rest_forbidden',
					__( 'Unsupported operation in batch.', 'surecart' ),
					[ 'status' => 403 ]
				);
			}
			if ( ! current_user_can( $cap ) ) {
				return new \WP_Error(
					'rest_forbidden',
					__( 'You are not allowed to perform one or more operations in this batch.', 'surecart' ),
					[ 'status' => 403 ]
				);
			}
		}

		return true;
	}

	/**
	 * Coarse gate for read-side endpoints; create_item enforces per-op auth.
	 *
	 * @return bool
	 */
	private function userCanUseBatches(): bool {
		foreach ( self::RESOURCE_CAP_SUFFIX as $suffix ) {
			if ( current_user_can( 'edit_' . $suffix ) ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Returns null for unknown paths — callers treat null as deny.
	 *
	 * @param string $http_method GET, POST, PATCH, PUT, DELETE.
	 * @param string $path        e.g. `/v1/products/abc`.
	 * @return string|null
	 */
	private function requiredCapabilityFor( string $http_method, string $path ): ?string {
		if ( ! preg_match( '#^/v1/([a-z_]+)#i', $path, $matches ) ) {
			return null;
		}
		$resource = strtolower( $matches[1] );
		$suffix   = self::RESOURCE_CAP_SUFFIX[ $resource ] ?? null;
		if ( ! $suffix ) {
			return null;
		}

		$verb = strtoupper( $http_method );
		if ( 'GET' === $verb ) {
			return 'read_' . $suffix;
		}
		if ( 'DELETE' === $verb ) {
			return 'delete_' . $suffix;
		}

		return 'edit_' . $suffix;
	}
}
