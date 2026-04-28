<?php

namespace SureCart\Controllers\Rest;

use SureCart\Concerns\SanitizesRestParams;
use SureCart\Models\IncomingWebhook;

/**
 * Handle Price requests through the REST API
 */
class IncomingWebhooksController {
	use SanitizesRestParams;

	/**
	 * Create a product integration.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function create( \WP_REST_Request $request ) {
		return IncomingWebhook::create( $request->get_params() );
	}

	/**
	 * Retry the incoming webhook.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return void
	 */
	public function retry( \WP_REST_Request $request ) {
		try {
			$webhook = \SureCart::async()->handle( $request['id'] );
		} catch ( \Exception $e ) {
			return new \WP_Error( 'webhook_retry_failed', $e->getMessage() );
		}

		if ( is_wp_error( $webhook ) ) {
			return $webhook;
		}

		if ( empty( $webhook ) ) {
			return new \WP_Error( 'webhook_retry_failed', 'Webhook retry failed.' );
		}

		return $webhook->toArray();
	}

	/**
	 * List all product integrations.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function index( \WP_REST_Request $request ) {
		$webhook = new IncomingWebhook();

		// processed is false.
		if ( false === $request->get_param( 'processed' ) ) {
			$webhook = $webhook->whereNull( 'processed_at' );
		} elseif ( ! empty( $request->get_param( 'processed' ) ) ) {
			$webhook = $webhook->whereNotNull( 'processed_at' );
		}

		// webhook ids.
		$webhook_ids = $request->get_param( 'webhook_ids' );
		if ( ! empty( $webhook_ids ) ) {
			$webhook = $webhook->whereIn( 'webhook_ids', array_map( 'sanitize_text_field', (array) $webhook_ids ) );
		}

		$total    = $webhook->count();
		$page     = $request->get_param( 'page' ) ? $request->get_param( 'page' ) : 1;
		$per_page = $request->get_param( 'per_page' ) ? $request->get_param( 'per_page' ) : 10;

		// handle pagination.
		$items = $webhook->paginate(
			[
				'page'     => $page,
				'per_page' => $per_page,
			]
		);

		$response = rest_ensure_response( $items );
		$response->header( 'X-WP-Total', (int) $total );
		$response->header( 'X-WP-TotalPages', (int) ceil( $total / (int) $per_page ) );

		return $response;
	}

	/**
	 * Find a specific product integration.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function find( \WP_REST_Request $request ) {
		$webhook = new IncomingWebhook();

		// processed is false.
		if ( false === $request->get_param( 'processed' ) ) {
			$webhook = $webhook->whereNull( 'processed' );
		} elseif ( ! empty( $request->get_param( 'processed' ) ) ) {
			$webhook = $webhook->whereNotNull( 'processed' );
		}

		$webhook_id = $this->sanitizeFilterParam( $request->get_param( 'webhook_id' ) );
		if ( null !== $webhook_id ) {
			$webhook = $webhook->where( 'webhook_id', $webhook_id );
		}

		return $webhook->find( $this->sanitizeFilterParam( $request['id'] ) );
	}

	/**
	 * Edit model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function edit( \WP_REST_Request $request ) {
		return IncomingWebhook::where(
			array_filter(
				[
					'id'         => $this->sanitizeFilterParam( $request['id'] ),
					'webhook_id' => $this->sanitizeFilterParam( $request->get_param( 'webhook_id' ) ),
				],
				function ( $value ) {
					return null !== $value;
				}
			)
		)->update( array_diff_assoc( $request->get_params(), $request->get_query_params() ) );
	}

	/**
	 * Delete model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function delete( \WP_REST_Request $request ) {
		return IncomingWebhook::delete( $request['id'] );
	}
}
