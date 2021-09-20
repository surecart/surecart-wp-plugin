<?php

namespace CheckoutEngine\Controllers\Admin\Customers;

use CheckoutEngine\Models\Product;
use WPEmerge\Responses\RedirectResponse;
use CheckoutEngine\Controllers\Admin\Customers\CustomersListTable;

/**
 * Handles product admin requests.
 */
class CustomersController {

	/**
	 * Products index.
	 */
	public function index() {
		$table = new CustomersListTable();
		$table->prepare_items();
		return \CheckoutEngine::view( 'admin.customers.index' )->with( [ 'table' => $table ] );
	}

	/**
	 * Edit a product.
	 */
	public function edit() {
		return \CheckoutEngine::view( 'admin.products.edit' );
	}

	/**
	 * Change the archived attribute in the model
	 *
	 * @param \WPEmerge\Requests\RequestInterface $request Request.
	 * @return void
	 */
	public function toggleArchive( $request ) {
		$product = Product::find( $request->query( 'id' ) );

		if ( is_wp_error( $product ) ) {
			\CheckoutEngine::flash()->add( 'errors', $product->get_error_message() );
			return $this->redirectBack( $request );
		}

		$updated = $product->update(
			[
				'archived' => ! $product->archived,
			]
		);

		if ( is_wp_error( $updated ) ) {
			\CheckoutEngine::flash()->add( 'errors', $updated->get_error_message() );
			return $this->redirectBack( $request );
		}

		\CheckoutEngine::flash()->add(
			'success',
			$updated->archived ? __( 'Product archived.', 'checkout_engine' ) : __( 'Product restored.', 'checkout_engine' )
		);

		return $this->redirectBack( $request );
	}

	public function redirectBack( $request ) {
		return ( new RedirectResponse( $request ) )->back();
	}
}
