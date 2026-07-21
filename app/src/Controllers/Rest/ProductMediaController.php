<?php

namespace SureCart\Controllers\Rest;

use SureCart\Concerns\RestrictsAnonymousReads;
use SureCart\Models\ProductMedia;

/**
 * Handle ProductMedia requests through the REST API
 */
class ProductMediaController extends RestController {
	use RestrictsAnonymousReads;

	/**
	 * Always fetch with these subcollections.
	 *
	 * @var array
	 */
	protected $with = [ 'media' ];

	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = ProductMedia::class;

	/**
	 * Capability that unlocks unrestricted reads.
	 *
	 * @var string
	 */
	protected $edit_capability = 'edit_sc_products';

	/**
	 * Expands safe to forward for anonymous callers.
	 *
	 * @var array
	 */
	protected $anonymous_expands = [ 'media' ];

	/**
	 * Query filters forced for anonymous callers.
	 *
	 * @var array
	 */
	protected $anonymous_scope = [];

	/**
	 * Download a media file.
	 *
	 * @param \WP_REST_Request $request Request object.
	 *
	 * @return integer|\WP_Error
	 */
	public function download( \WP_REST_Request $request ) {
		$model = $this->middleware( new $this->class(), $request );
		if ( is_wp_error( $model ) ) {
			return $model;
		}

		$media = $model->with( [ 'media' ] )->find( $request['id'] );

		if ( is_wp_error( $media ) ) {
			return $media;
		}

		$attachment_id = $media->download();

		if ( is_wp_error( $attachment_id ) ) {
			return $attachment_id;
		}

		return $attachment_id;
	}
}
