<?php

namespace SureCart\Controllers\Admin\Products;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Models\Product;
use SureCartCore\Responses\RedirectResponse;
use SureCart\Controllers\Admin\Products\ProductsListTable;

/**
 * Handles product admin requests.
 */
class ProductsController extends AdminController {
	/**
	 * Products index.
	 */
	public function index() {
		$table = new ProductsListTable();
		$table->prepare_items();
		$this->withHeader(
			[
				'products' => [
					'title' => __( 'Products', 'surecart' ),
				],
			]
		);
		return \SureCart::view( 'admin/products/index' )->with( [ 'table' => $table ] );
	}

	/**
	 * Edit a product.
	 */
	public function edit( $request ) {
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( ProductScriptsController::class, 'enqueue' ) );

		// add instant checkout link.
		add_action(
			'admin_bar_menu',
			function( $wp_admin_bar ) use ( $request ) {
				$product = Product::find( $request->query( 'id' ) );
				$wp_admin_bar->add_node(
					[
						'id'    => 'view-product-page',
						'title' => __( 'View Product', 'surecart' ),
						'href'  => esc_url( $product->permalink ),
					]
				);
			},
			99
		);

		// return view.
		return '<div id="app"></div>';
	}

	public function addInstantCheckoutLink( $wp_admin_bar ) {
		$wp_admin_bar->add_node(
			[
				'id'    => 'edit',
				'title' => __( 'Edit Product', 'surecart' ),
				'href'  => '#',
			]
		);
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
			wp_die( implode( ' ', array_map( 'esc_html', $product->get_error_messages() ) ) );
		}

		$updated = $product->update(
			[
				'archived' => ! (bool) $product->archived,
			]
		);

		if ( is_wp_error( $updated ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $updated->get_error_messages() ) ) );
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
