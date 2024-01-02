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
	 * Get the sync url.
	 *
	 * @return string
	 */
	protected function getSyncUrl() {
		return esc_url(
			add_query_arg(
				[
					'action' => 'sync_products',
					'nonce'  => wp_create_nonce( 'sync_products' ),
				],
			)
		);
	}

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
			],
			'<div><a href="' . esc_url( $this->getSyncUrl() ) . '" class="button button-primary">' . __( 'Sync Products', 'surecart' ) . '</a></div>',
		);
		return \SureCart::view( 'admin/products/index' )->with( [ 'table' => $table ] );
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
			$this->preloadPaths(
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
				]
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

	/**
	 * Start product sync.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 *
	 * @return \SureCartCore\Responses\RedirectResponse
	 */
	public function sync( $request ) {
		\SureCart::migration()->deleteAll();
		// dispatch job.
		\SureCart::migration()->models()->dispatch();

		return $this->redirectBack( $request );
	}

	/**
	 * Redirect back.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 *
	 * @return \SureCartCore\Responses\RedirectResponse
	 */
	public function redirectBack( $request ) {
		return ( new RedirectResponse( $request ) )->back();
	}
}
