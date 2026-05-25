<?php

namespace SureCart\Controllers\Admin\ProductCollections;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Controllers\Admin\RendersEnhancedAdminView;
use SureCart\Models\ProductCollection;

/**
 * Handles product collections admin requests.
 */
class ProductCollectionsController extends AdminController {
	use RendersEnhancedAdminView;

	/**
	 * Render the WP List Table view.
	 */
	protected function renderWpListView() {
		$table = new ProductCollectionsListTable();
		$table->prepare_items();

		$this->withHeader(
			array(
				'breadcrumbs'         => [
					'product-collections' => [
						'title' => __( 'Product Collections', 'surecart' ),
					],
				],
				'enhanced_view_promo' => admin_url( 'admin.php?page=sc-product-collections' ),
			),
		);

		return \SureCart::view( 'admin/product-collections/index' )->with(
			[
				'table' => $table,
			]
		);
	}

	/**
	 * Render the SPA view for product collections.
	 */
	protected function renderSpaView() {
		$this->enqueueSpaScripts( ProductCollectionsScriptsController::class );
		return $this->renderSpaShell(
			'admin/product-collections/spa',
			'product-collections',
			__( 'Product Collections', 'surecart' )
		);
	}

	/**
	 * Edit a product collection.
	 *
	 * @param \WP_REST_Request $request Request.
	 */
	public function edit( $request ) {
		// enqueue needed script.
		$this->enqueueSpaScripts( ProductCollectionsScriptsController::class );

		$product_collection = null;

		if ( $request->query( 'id' ) ) {
			$product_collection = ProductCollection::find( $request->query( 'id' ) );

			if ( is_wp_error( $product_collection ) ) {
				wp_die( implode( ' ', array_map( 'esc_html', $product_collection->get_error_messages() ) ) );
			}

			if ( ! empty( $product_collection ) ) {
				$this->preloadAPIRequests( $product_collection );
			}

			// add product collection link.
			if ( ! empty( $product_collection ) ) {
				add_action(
					'admin_bar_menu',
					function ( $wp_admin_bar ) use ( $product_collection ) {
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
		}

		return $this->renderSpaShell( 'admin/product-collections/spa' );
	}

	/**
	 * Preload API Requests.
	 *
	 * @param \SureCart\Models\ProductCollection $product_collection The product collection.
	 *
	 * @return void
	 */
	public function preloadAPIRequests( ProductCollection $product_collection ): void {
		$preload_paths = array(
			array( '/wp/v2/templates', 'OPTIONS' ),
			'/wp/v2/settings',
			'/wp/v2/types/wp_template?context=edit',
			'/wp/v2/types/wp_template-part?context=edit',
			'/wp/v2/templates?context=edit&per_page=-1',
			'/wp/v2/template-parts?context=edit&per_page=-1',
			'/wp/v2/users/me',
			'/wp/v2/types?context=view',
			'/wp/v2/types?context=edit',
			'/wp/v2/templates/' . $product_collection->template_id . '?context=edit',
			'/wp/v2/template-parts/' . $product_collection->template_part_id . '?context=edit',
			'/surecart/v1/product_collections/' . $product_collection->id . '?context=edit&expand[0]=media',
		);

		$this->preloadPaths( $preload_paths );
	}
}
