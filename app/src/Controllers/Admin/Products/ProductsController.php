<?php

namespace SureCart\Controllers\Admin\Products;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Models\Product;
use SureCart\Controllers\Admin\Products\ProductsListTable;
use SureCart\Background\BulkActionService;

/**
 * Handles product admin requests.
 */
class ProductsController extends AdminController {

	/**
	 * Get the sync url.
	 *
	 * @return string
	 */
	protected function getSyncUrl() {
		return esc_url(
			add_query_arg(
				[
					'action' => 'sync',
					'nonce'  => wp_create_nonce( 'sync_products' ),
				],
			)
		);
	}

	/**
	 * Products index.
	 */
	public function index() {
		$bulk_action_service = new BulkActionService();
		$bulk_action_service->bootstrap();
		$table = new ProductsListTable( $bulk_action_service );
		$table->prepare_items();
		$this->withHeader(
			array(
				'breadcrumbs' => [
					'products' => [
						'title' => __( 'Products', 'surecart' ),
					],
				],
				'suffix'      => '<div><a href="' . esc_url( $this->getSyncUrl() ) . '" class="button button-primary">' . __( 'Sync Products', 'surecart' ) . '</a></div>',
			)
		);
		return \SureCart::view( 'admin/products/index' )->with( [ 'table' => $table ] );
	}

	/**
	 * Confirm Bulk Delete.
	 */
	public function confirmBulkDelete() {
		$products = Product::where(
			[
				'ids' => array_map( 'esc_html', $_REQUEST['bulk_action_product_ids'] ),
			]
		)->get(); // phpcs:ignore WordPress.Security.NonceVerification.Recommended

		if ( empty( $products ) ) {
			wp_die( esc_html( _n( 'This product has already been deleted.', 'These products have already been deleted.', count( $_REQUEST['bulk_action_product_ids'] ), 'surecart' ) ) );
		}

		$this->withHeader(
			[
				'delete' => [
					'title' => _n( 'Delete Product', 'Delete Products.', count( $products ), 'surecart' ),
				],
			],
			'<div><a href="' . esc_url( $this->getSyncUrl() ) . '" class="button button-primary">' . __( 'Sync Products', 'surecart' ) . '</a></div>',
		);

		return \SureCart::view( 'admin/products/confirm-bulk-delete' )->with( [ 'products' => $products ] );
	}

	/**
	 * Bulk Delete.
	 */
	public function bulkDelete() {
		$product_ids = array_map( 'sanitize_text_field', $_REQUEST['bulk_action_product_ids'] ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$action      = \SureCart::bulkAction()->createBulkAction( 'delete_products', $product_ids );

		// handle error.
		if ( is_wp_error( $action ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $action->get_error_messages() ) ) );
		}

		// redirect.
		return \SureCart::redirect()->to( esc_url_raw( admin_url( 'admin.php?page=sc-products' ) ) );
	}

	/**
	 * Edit a product.
	 */
	public function edit( $request ) {
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( ProductScriptsController::class, 'enqueue' ) );

		$product = null;

		if ( $request->query( 'id' ) ) {
			$product = Product::find( $request->query( 'id' ) );

			if ( is_wp_error( $product ) ) {
				wp_die( implode( ' ', array_map( 'esc_html', $product->get_error_messages() ) ) );
			}
		}

		if ( ! empty( $product ) ) {
			$gallery_paths = [];
			$gallery       = $product->post->gallery;
			foreach ( $gallery as $item ) {
				if ( is_int( $item->id ) ) {
					$gallery_paths[] = '/wp/v2/media/' . $item->id . '?context=edit';
				}
			}

			$this->preloadPaths(
				array_merge(
					[
						[ '/wp/v2/templates', 'OPTIONS' ],
						'/wp/v2/settings',
						'/wp/v2/types/wp_template?context=edit',
						'/wp/v2/types/wp_template-part?context=edit',
						'/wp/v2/templates?context=edit&per_page=-1',
						'/wp/v2/template-parts?context=edit&per_page=-1',
						'/wp/v2/users/me',
						'/wp/v2/types?context=view',
						'/wp/v2/types?context=edit',
						'/wp/v2/templates/' . $product->template_id . '?context=edit',
						'/wp/v2/template-parts/' . $product->template_part_id . '?context=edit',
						'/surecart/v1/products/' . $product->id . '?context=edit',
						// '/surecart/v1/product_medias?context=edit&product_ids[0]=' . $product->id . '&per_page=100',
						// '/surecart/v1/prices?context=edit&product_ids[0]=' . $product->id . '&per_page=100',
						'/surecart/v1/integrations?context=edit&model_ids[0]=' . $product->id . '&per_page=50',
						'/surecart/v1/integration_providers?context=edit',
						'/surecart/v1/integration_provider_items?context=edit',
					],
					$gallery_paths
				)
			);
		}

		// add product link.
		add_action(
			'admin_bar_menu',
			function( $wp_admin_bar ) use ( $product ) {
				$wp_admin_bar->add_node(
					[
						'id'    => 'view-product-page',
						'title' => __( 'View Product', 'surecart' ),
						'href'  => esc_url( $product->permalink ?? '#' ),
						'meta'  => [
							'class' => empty( $product->permalink ) ? 'hidden' : '',
						],
					]
				);
			},
			99
		);

		// return view.
		return '<div id="app"></div>';
	}

	/**
	 * Change the archived attribute in the model
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 *
	 * @return \SureCartCore\Responses\RedirectResponse
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

		return \SureCart::redirect()->to(
			esc_url_raw( add_query_arg( 'status', ( $updated->archived ? 'archived' : 'active' ), admin_url( 'admin.php?page=sc-products' ) ) )
		);
	}

	/**
	 * Start product sync.
	 *
	 * @return \SureCartCore\Responses\RedirectResponse
	 */
	public function sync() {
		// dispatch the sync job.
		\SureCart::sync()->products()->dispatch( [ 'with_collections' => true ] );

		// redirect back.
		return \SureCart::redirect()->to(
			esc_url_raw( admin_url( 'admin.php?page=sc-products' ) )
		);
	}

	/**
	 * Cancel product sync.
	 *
	 * @return \SureCartCore\Responses\RedirectResponse
	 */
	public function cancelSync() {
		\SureCart::migration()->deleteAll();

		return \SureCart::redirect()->to(
			esc_url_raw( admin_url( 'admin.php?page=sc-products' ) )
		);
	}
}
