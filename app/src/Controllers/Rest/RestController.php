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
	 * Run some middleware to run before request.
	 *
	 * @param \CheckoutEngine\Models\Model $class Model class instance.
	 * @param \WP_REST_Request             $request Request object.
	 *
	 * @return \CheckoutEngine\Models\Model
	 */
	protected function middleware( \CheckoutEngine\Models\Model $class, \WP_REST_Request $request ) {
		return apply_filters( 'checkout_engine/request/model', $class, $request );
	}

	/**
	 * Create model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function create( \WP_REST_Request $request ) {
		$model = $this->middleware( new $this->class(), $request );
		return $model->where( $request->get_query_params() )->create( $request->get_body_params() );
	}

	/**
	 * Index model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function index( \WP_REST_Request $request ) {
		$model = $this->middleware( new $this->class(), $request );
		return $model->where( $request->get_params() )->get();
	}

	/**
	 * Find model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function find( \WP_REST_Request $request ) {
		$model = $this->middleware( new $this->class(), $request );
		return $model->where( $request->get_query_params() )->find( $request['id'] );
	}

	/**
	 * Edit model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function edit( \WP_REST_Request $request ) {
		$model = $this->middleware( new $this->class(), $request );
		return $model->where( $request->get_query_params() )->update( $request->get_params() );
	}

	/**
	 * Delete model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function delete( \WP_REST_Request $request ) {
		$model = $this->middleware( new $this->class(), $request );
		return $model->delete( $request['id'] );
	}
}
