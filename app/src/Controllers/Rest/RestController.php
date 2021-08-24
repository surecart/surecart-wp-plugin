<?php

namespace CheckoutEngine\Controllers\Rest;

/**
 * Rest controller base class.
 */
abstract class RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = '';

	/**
	 * Create price
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function create( \WP_REST_Request $request ) {
		return $this->class::create( $request->get_params() );
	}

	/**
	 * Price index
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function index( \WP_REST_Request $request ) {
		return $this->class::where(
			[
				'active' => $request['active'] ?? null,
				'ids'    => $request['ids'] ?? null,
			]
		)->get();
	}

	/**
	 * Find model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function find( \WP_REST_Request $request ) {
		return $this->class::find( $request['id'] );
	}

	/**
	 * Edit model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function edit( \WP_REST_Request $request ) {
		return $this->class::update( $request->get_params() );
	}

	/**
	 * Delete model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function delete( \WP_REST_Request $request ) {
		return $this->class::delete( $request['id'] );
	}
}
