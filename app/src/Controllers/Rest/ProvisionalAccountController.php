<?php

namespace SureCart\Controllers\Rest;

use SureCart\Models\Account;
use SureCart\Models\ProvisionalAccount;

/**
 * Handle Provisional account requests through the REST API
 */
class ProvisionalAccountController extends RestController {
	/**
	 * Class to make the requests.
	 *
	 * @var string
	 */
	protected $class = ProvisionalAccount::class;

	/**
	 * Create model.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function create( \WP_REST_Request $request ) {
		// add name and url to provisional account.
		$request->set_param( 'account_name', get_bloginfo( 'name' ) );
		$request->set_param( 'account_url', get_bloginfo( 'url' ) );

		return parent::create( $request );
	}

	/**
	 * When indexing, fetch the account.
	 *
	 * @param \WP_REST_Request $request Rest Request.
	 *
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function index( \WP_REST_Request $request ) {
		return Account::find();
	}
}
