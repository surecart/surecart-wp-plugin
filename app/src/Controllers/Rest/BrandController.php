<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Brand;

/**
 * Handle coupon requests through the REST API
 */
class BrandController {
	/**
	 * Find.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function find( \WP_REST_Request $request ) {
		return Brand::with( [ 'address' ] )->find();
	}

	/**
	 * Edit model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function edit( \WP_REST_Request $request ) {
		if ( isset( $request->get_params()['site_theme'] ) ) {
			update_option( 'surecart-theme-data', $request->get_params()['site_theme'] );
		}
		return Brand::with( [ 'address' ] )->update( array_diff_assoc( $request->get_params(), $request->get_query_params() ) );
	}

	/**
	 * Purge the product image
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response
	 */
	public function purgeLogo( \WP_REST_Request $request ) {
		return Brand::with( [ 'address' ] )->where( $request->get_query_params() )->purgeLogo();
	}
}
