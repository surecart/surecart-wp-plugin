<?php

namespace SureCart\Controllers\Admin\Products;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Models\Product;
use SureCartCore\Responses\RedirectResponse;
use SureCart\Controllers\Admin\Products\ProductsListTable;
use SureCart\Models\BulkAction;

/**
 * Handles product admin requests.
 */
class ProductsController extends AdminController {

	public $bulk_actions_data = [];
	public $bulk_actions      = [];
	public $statuses          = array( 'succeeded', 'processing', 'pending', 'invalid', 'completed' );

	/**
	 * Products index.
	 */
	public function index() {
		$this->initBulkActions();
		$table = new ProductsListTable( $this );
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
	 * Initiate Bulk Actions Processing.
	 */
	public function initBulkActions() {
		$this->bulk_actions = ! empty( $_COOKIE['sc_bulk_actions'] ) ? json_decode( stripslashes( $_COOKIE['sc_bulk_actions'] ), true ) : array(); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( ! empty( $this->bulk_actions ) ) {
			$this->set_bulk_actions_data();
			$this->delete_succeeded_bulk_actions();
		}
	}

	/**
	 * Get the bulk actions data.
	 */
	public function set_bulk_actions_data() {
		$bulk_actions = array();

		if ( is_array( $this->bulk_actions ) ) {
			foreach ( $this->bulk_actions as $bulk_action_id ) {
				$bulk_action = BulkAction::find( $bulk_action_id );
				foreach ( $this->statuses as $status ) {
					if ( ! isset( $bulk_actions[ $bulk_action->action_type ][ $status . '_record_ids' ] ) ) {
						$bulk_actions[ $bulk_action->action_type ][ $status . '_record_ids' ] = array();
					}
					if ( ! isset( $bulk_actions[ $bulk_action->action_type ][ $status . '_bulk_actions' ] ) ) {
						$bulk_actions[ $bulk_action->action_type ][ $status . '_bulk_actions' ] = array();
					}
				}
				if ( ! is_wp_error( $bulk_action ) ) {
					$bulk_actions[ $bulk_action->action_type ][ $bulk_action->status ][] = $bulk_action;
					array_push( $bulk_actions[ $bulk_action->action_type ][ $bulk_action->status . '_bulk_actions' ], $bulk_action->id );
					array_push( $bulk_actions[ $bulk_action->action_type ][ $bulk_action->status . '_record_ids' ], ...$bulk_action->record_ids );
				}
			}
		}
		$this->bulk_actions_data = $bulk_actions;
	}

	/**
	 * Delete succeeded bulk actions from the cookie.
	 */
	public function delete_succeeded_bulk_actions() {
		$this->bulk_actions = array_filter(
			$this->bulk_actions,
			function( $bulk_action_id ) {
				return ! in_array(
					$bulk_action_id,
					$this->bulk_actions_data['delete_products']['succeeded_bulk_actions'] ?? [],
					true
				);
			}
		);
		setcookie(
			'sc_bulk_actions',
			wp_json_encode( $this->bulk_actions ),
			time() + DAY_IN_SECONDS,
			COOKIEPATH,
			COOKIE_DOMAIN,
			is_ssl(),
			true
		);
	}

	/**
	 * Bulk Delete.
	 */
	public function bulkDelete() {
		$table = new ProductsListTable( $this );
		$table->process_bulk_action();
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

	public function redirectBack( $request ) {
		return ( new RedirectResponse( $request ) )->back();
	}
}
