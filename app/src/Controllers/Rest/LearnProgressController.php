<?php

namespace SureCart\Controllers\Rest;

/**
 * Handle learn progress requests through the REST API.
 */
class LearnProgressController extends RestController {
	/**
	 * The user meta key for storing learn progress.
	 *
	 * @var string
	 */
	protected $meta_key = 'sc_learn_progress';

	/**
	 * Get the learn progress for the current user.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return array|\WP_Error
	 */
	public function index( \WP_REST_Request $request ) {
		$user_id = get_current_user_id();
		if ( ! $user_id ) {
			return new \WP_Error( 'not_logged_in', __( 'You must be logged in.', 'surecart' ), [ 'status' => 401 ] );
		}

		$progress = get_user_meta( $user_id, $this->meta_key, true );

		return [
			'completed_steps' => ! empty( $progress ) ? (array) $progress : [],
		];
	}

	/**
	 * Update the learn progress for the current user.
	 *
	 * @param \WP_REST_Request $request The REST request object.
	 *
	 * @return array|\WP_Error
	 */
	public function create( \WP_REST_Request $request ) {
		$user_id = get_current_user_id();
		if ( ! $user_id ) {
			return new \WP_Error( 'not_logged_in', __( 'You must be logged in.', 'surecart' ), [ 'status' => 401 ] );
		}

		$completed_steps = $request->get_param( 'completed_steps' );

		if ( ! is_array( $completed_steps ) ) {
			return new \WP_Error( 'invalid_data', __( 'Invalid data format.', 'surecart' ), [ 'status' => 400 ] );
		}

		// Sanitize step IDs.
		$completed_steps = array_map( 'sanitize_text_field', $completed_steps );
		$completed_steps = array_values( array_unique( $completed_steps ) );

		update_user_meta( $user_id, $this->meta_key, $completed_steps );

		return [
			'completed_steps' => $completed_steps,
		];
	}
}
