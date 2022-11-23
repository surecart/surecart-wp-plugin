<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\VerifyCode;

/**
 * Handle verify code requests through the REST API
 */
class VerifyCodeController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = VerifyCode::class;

    /**
	 * Finalize an order.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \SureCart\Models\Checkout|\WP_Error
	 */
	public function verify( \WP_REST_Request $request ) {
        return VerifyCode::with([''])->where( $request->get_query_params() )->verify();
	}
}
