<?php

namespace SureCart\Controllers\Admin\Customers;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Models\Product;
use SureCartCore\Responses\RedirectResponse;
use SureCart\Controllers\Admin\Customers\CustomersListTable;

/**
 * Handles product admin requests.
 */
class CustomersController extends AdminController {

	/**
	 * Products index.
	 */
	public function index() {
		$table = new CustomersListTable();
		$table->prepare_items();
		$this->withHeader(
			[
				'customers' => [
					'title' => __( 'Customers', 'surecart' ),
				],
			]
		);
		return \SureCart::view( 'admin/customers/index' )->with( [ 'table' => $table ] );
	}

	/**
	 * Customers edit.
	 */
	public function edit( $request ) {
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( CustomersScriptsController::class, 'enqueue' ) );

		$this->preloadPaths(
			[
				'/wp/v2/users/me',
				'/wp/v2/types?context=view',
				'/wp/v2/types?context=edit',
				'/surecart/v1/customers/' . $request->query( 'id' ) . '?context=edit&expand%5B0%5D=balances',
			]
		);

		// return view.
		return '<div id="app"></div>';
	}

	/**
	 * Change the archived attribute in the model
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @return function
	 */
	public function toggleArchive( $request ) {
		$product = Product::find( $request->query( 'id' ) );

		if ( is_wp_error( $product ) ) {
			\SureCart::flash()->add( 'errors', $product->get_error_message() );
			return $this->redirectBack( $request );
		}

		$updated = $product->update(
			[
				'archived' => ! $product->archived,
			]
		);

		if ( is_wp_error( $updated ) ) {
			\SureCart::flash()->add( 'errors', $updated->get_error_message() );
			return $this->redirectBack( $request );
		}

		\SureCart::flash()->add(
			'success',
			$updated->archived ? __( 'Product archived.', 'surecart' ) : __( 'Product restored.', 'surecart' )
		);

		return $this->redirectBack( $request );
	}

	public function redirectBack( $request ) {
		return ( new RedirectResponse( $request ) )->back();
	}
}
