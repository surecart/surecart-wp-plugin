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
	 * Anyone with `edit_sc_products` (the typical bulk-action gate) can
	 * create/list/retrieve batches. Tighten if a batch ever runs ops the
	 * caller wouldn't otherwise be authorised for.
	 */
	public function get_items_permissions_check( $request ) {
		return current_user_can( 'edit_sc_products' );
	}

	public function get_item_permissions_check( $request ) {
		return current_user_can( 'edit_sc_products' );
	}

	public function create_item_permissions_check( $request ) {
		return current_user_can( 'edit_sc_products' );
	}

	public function update_item_permissions_check( $request ) {
		return current_user_can( 'edit_sc_products' );
	}

	public function delete_item_permissions_check( $request ) {
		return current_user_can( 'edit_sc_products' );
	}
}
