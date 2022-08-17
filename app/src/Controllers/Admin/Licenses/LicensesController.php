<?php

namespace SureCart\Controllers\Admin\Licenses;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Models\Product;
use SureCartCore\Responses\RedirectResponse;
use SureCart\Controllers\Admin\Licenses\LicensesListTable;

/**
 * Handles product admin requests.
 */
class LicensesController extends AdminController {

	/**
	 * Products index.
	 */
	public function index() {
		$table = new LicensesListTable();
		$table->prepare_items();
		$this->withHeader(
			[
				'licenses' => [
					'title' => __( 'Licenses', 'surecart' ),
				],
			]
		);
		return \SureCart::view( 'admin/licenses/index' )->with( [ 'table' => $table ] );
	}

	/**
	 * Licenses edit.
	 */
	public function edit() {
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( LicensesScriptsController::class, 'enqueue' ) );
		// return view.
		return '<div id="app"></div>';
	}

	/**
	 * Change the archived attribute in the model
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @return void
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
