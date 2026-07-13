<?php

namespace SureCart\Concerns;

/**
 * Restricts what anonymous callers can read from catalog REST endpoints
 * that proxy the private platform API with the store's secret token.
 *
 * Controllers using this trait must declare these properties:
 * - `$edit_capability` (string) The capability that unlocks unrestricted reads.
 * - `$anonymous_expands` (array) Expand values safe to forward for anonymous callers.
 * - `$anonymous_scope` (array) Query filters forced onto anonymous requests.
 *
 * Optionally:
 * - `$anonymous_hides_archived` (bool) Hide archived records on find for anonymous callers.
 * - `$anonymous_visible_statuses` (array) Only these statuses are visible on find for anonymous callers.
 */
trait RestrictsAnonymousReads {
	/**
	 * Run some middleware to run before request.
	 *
	 * @param \SureCart\Models\Model $class Model class instance.
	 * @param \WP_REST_Request       $request Request object.
	 *
	 * @return \SureCart\Models\Model
	 */
	protected function middleware( $class, \WP_REST_Request $request ) {
		return parent::middleware( $this->restrictAnonymousReads( $class, $request ), $request );
	}

	/**
	 * Force the anonymous read scope and expand allow-list for callers
	 * without the edit capability.
	 *
	 * Runs before the request params are merged into the model query, so
	 * the forced filters win over client params (see Model::where merge order).
	 *
	 * @param \SureCart\Models\Model $class Model class instance.
	 * @param \WP_REST_Request       $request Request object.
	 *
	 * @return \SureCart\Models\Model
	 */
	protected function restrictAnonymousReads( $class, \WP_REST_Request $request ) {
		if ( current_user_can( $this->edit_capability ) ) {
			return $class;
		}

		// only allow-listed expands may be forwarded to the platform.
		if ( ! empty( $request['expand'] ) ) {
			$request->set_param( 'expand', array_values( array_intersect( array_filter( (array) $request['expand'], 'is_string' ), $this->anonymous_expands ) ) );
		}

		if ( ! empty( $this->anonymous_scope ) ) {
			$class->where( $this->anonymous_scope );
		}

		return $class;
	}

	/**
	 * Find model.
	 *
	 * Platform show endpoints ignore list filters, so hide draft and
	 * archived records from anonymous callers after fetching.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \SureCart\Models\Model|\WP_Error
	 */
	public function find( \WP_REST_Request $request ) {
		$model = parent::find( $request );

		if ( is_wp_error( $model ) || current_user_can( $this->edit_capability ) ) {
			return $model;
		}

		if ( $this->isHiddenFromAnonymous( $model ) ) {
			return new \WP_Error( 'rest_not_found', __( 'Not found.', 'surecart' ), [ 'status' => 404 ] );
		}

		return $model;
	}

	/**
	 * Should this record be hidden from anonymous callers?
	 *
	 * @param \SureCart\Models\Model $model Fetched model.
	 *
	 * @return boolean
	 */
	protected function isHiddenFromAnonymous( $model ) {
		if ( ! empty( $this->anonymous_hides_archived ) && true === $model->archived ) {
			return true;
		}

		if ( ! empty( $this->anonymous_visible_statuses ) && ! empty( $model->status ) && ! in_array( $model->status, $this->anonymous_visible_statuses, true ) ) {
			return true;
		}

		return false;
	}
}
