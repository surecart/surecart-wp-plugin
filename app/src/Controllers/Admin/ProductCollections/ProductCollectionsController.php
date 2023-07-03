<?php

namespace SureCart\Controllers\Admin\ProductCollections;

use SureCart\Models\ProductCollection;

/**
 * Handles product collections admin requests.
 */
class ProductCollectionsController {
	/**
	 * Index.
	 */
	public function index() {
		$table = new ProductCollectionsListTable();
		$table->prepare_items();
		return \SureCart::view( 'admin/product-collections/index' )->with(
			[
				'table' => $table,
			]
		);
	}

	/**
	 * Show
	 */
	public function show() {
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( self::class, 'enqueue' ) );
		// return view.
		return '<div id="app"></div>';
	}

	/**
	 * Edit a product.
	 *
	 * @param \WP_REST_Request $request Request.
	 */
	public function edit( $request ) {
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( ProductCollectionsScriptsController::class, 'enqueue' ) );

		$product_collection = null;

		if ( $request->query( 'id' ) ) {
			$product_collection = ProductCollection::find( $request->query( 'id' ) );

			if ( is_wp_error( $product_collection ) ) {
				wp_die( implode( ' ', array_map( 'esc_html', $product_collection->get_error_messages() ) ) );
			}

			// add product collection link.
			add_action(
				'admin_bar_menu',
				function( $wp_admin_bar ) use ( $product_collection ) {
					$wp_admin_bar->add_node(
						[
							'id'    => 'view-product-collection-page',
							'title' => __( 'View Collection', 'surecart' ),
							'href'  => esc_url( $product_collection->permalink ?? '#' ),
							'meta'  => [
								'class' => empty( $product_collection->permalink ) ? 'hidden' : '',
							],
						]
					);
				},
				99
			);
		}

		// return view.
		return '<div id="app"></div>';
	}
}
