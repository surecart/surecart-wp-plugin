<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Product;

/**
 * Handle Product requests through the REST API
 */
class ProductsController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = Product::class;

	/**
	 * Run some middleware to run before request.
	 *
	 * @param \SureCart\Models\Model $class Model class instance.
	 * @param \WP_REST_Request       $request Request object.
	 *
	 * @return \SureCart\Models\Model
	 */
	protected function middleware( $class, \WP_REST_Request $request ) {
		// if we are in edit context, we want to fetch the variants, variant options and prices.
		if ( 'edit' === $request->get_param( 'context' ) || in_array( $request->get_method(), [ 'POST', 'PUT', 'PATCH', 'DELETE' ] ) ) {
			$class->with( array_unique( array_filter( array_merge( [ 'variants', 'variant_options', 'variants.image', 'prices', 'product_collections', 'commission_structure', 'product_medias', 'product_media.media' ], $request['expand'] ?? [] ) ) ) );
		}
		return parent::middleware( $class, $request );
	}

	/**
	 * Edit model.
	 *
	 * Filter out variations which statuses are draft.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function edit( \WP_REST_Request $request ) {
		// if cataloged_at is set for future date, return error.
		if ( ! empty( $request['cataloged_at'] ) && $request['cataloged_at'] > time() ) {
			return new \WP_Error( 'invalid_cataloged_at', __( 'The Cataloged at date cannot be in the future. Please provide a valid date.', 'surecart' ), [ 'status' => 400 ] );
		}

		// Stop if we are not editing a variable product.
		if ( empty( $request['variants'] ) ) {
			return parent::edit( $request );
		}

		// Filter draft variations.
		$request['variants'] = array_values(
			array_filter(
				$request['variants'],
				function ( $variation ) {
					return ! in_array( $variation['status'] ?? 'publish', [ 'draft', 'deleted' ] );
				}
			)
		);

		return parent::edit( $request );
	}

	/**
	 * Sync model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function sync( \WP_REST_Request $request ) {
		$model = $this->middleware( new $this->class(), $request );
		if ( is_wp_error( $model ) ) {
			return $model;
		}
		return $model->sync( $request['id'] );
	}

	/**
	 * Sync model.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function syncAll() {
		return \SureCart::sync()->products()->dispatch();
	}

	/**
	 * Duplicate model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function duplicate( \WP_REST_Request $request ) {
		$model = $this->middleware( new $this->class(), $request );
		if ( is_wp_error( $model ) ) {
			return $model;
		}
		return $model->duplicate( $request['id'] );
	}

	/**
	 * Import WooCommerce products.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function importWooCommerce() {
		if ( ! class_exists( 'WooCommerce' ) ) {
			return new \WP_Error(
				'woocommerce_not_active',
				__( 'WooCommerce is not active.', 'surecart' ),
				[ 'status' => 400 ]
			);
		}

		$service = \SureCart::sync()->woocommerce_products();

		if ( $service->isRunning() ) {
			return new \WP_Error(
				'import_already_running',
				__( 'A WooCommerce import is already in progress.', 'surecart' ),
				[ 'status' => 409 ]
			);
		}

		$result = $service->dispatch();
		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return rest_ensure_response( [ 'message' => __( 'WooCommerce import started.', 'surecart' ) ] );
	}

	/**
	 * Get count of importable WooCommerce products.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function wooCommerceCount() {
		if ( ! class_exists( 'WooCommerce' ) ) {
			return rest_ensure_response( [ 'count' => 0 ] );
		}

		$count = \SureCart::sync()->woocommerce_products()->getImportableCount();

		return rest_ensure_response( [ 'count' => $count ] );
	}
}
