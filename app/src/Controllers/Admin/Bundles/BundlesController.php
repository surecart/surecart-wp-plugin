<?php

namespace SureCart\Controllers\Admin\Bundles;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Models\Product;
use SureCart\Controllers\Admin\Bundles\BundlesListTable;
use SureCart\Controllers\Admin\Bundles\BundleScriptsController;
use SureCart\Background\BulkActionService;

/**
 * Handles bundle admin requests.
 */
class BundlesController extends AdminController {
	/**
	 * Bundles index.
	 */
	public function index() {
		// instantiate the bulk actions service.
		$bulk_action_service = new BulkActionService();
		$bulk_action_service->bootstrap();

		// instantiate the bundles list table.
		$table = new BundlesListTable( $bulk_action_service );
		$table->prepare_items();

		// add header.
		$this->withHeader(
			array(
				'breadcrumbs' => [
					'bundles' => [
						'title' => __( 'Bundles', 'surecart' ),
					],
				],
			),
		);

		// add notices.
		$this->withNotices(
			array(
				'sync_success' => __( 'Bundle synced successfully.', 'surecart' ),
				'archived'     => __( 'Bundle archived.', 'surecart' ),
				'unarchived'   => __( 'Bundle unarchived.', 'surecart' ),
				'duplicated'   => __( 'Bundle duplicated successfully.', 'surecart' ),
			)
		);

		// return view.
		return \SureCart::view( 'admin/bundles/index' )->with( [ 'table' => $table ] );
	}

	/**
	 * Confirm Bulk Delete.
	 */
	public function confirmBulkDelete() {
		// find the bundles queued for bulk deletion.
		if ( empty( $_REQUEST['bulk_action_product_ids'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			wp_die(
				sprintf(
					'%s <a href="%s">%s</a>',
					esc_html__( 'No bundles selected. Please choose at least one bundle to delete.', 'surecart' ),
					esc_url( admin_url( 'admin.php?page=sc-bundles' ) ),
					esc_html__( 'Go Back', 'surecart' )
				)
			);
		}

		$bundles = Product::where(
			[
				'ids' => array_map( 'esc_html', $_REQUEST['bulk_action_product_ids'] ), // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			]
		)->get();

		// handle empty.
		if ( empty( $bundles ) ) {
			wp_die( esc_html( _n( 'This bundle has already been deleted.', 'These bundles have already been deleted.', count( $_REQUEST['bulk_action_product_ids'] ), 'surecart' ) ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		}

		// handle error.
		if ( is_wp_error( $bundles ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $bundles->get_error_messages() ) ) );
		}

		// add header.
		$this->withHeader(
			[
				'delete' => [
					'title' => _n( 'Delete Bundle', 'Delete Bundles.', count( $bundles ), 'surecart' ),
				],
			],
		);

		// return view.
		return \SureCart::view( 'admin/bundles/confirm-bulk-delete' )->with( [ 'bundles' => $bundles ] );
	}

	/**
	 * Bulk Delete.
	 */
	public function bulkDelete() {
		$bundle_ids = array_map(
			'sanitize_text_field',
			$_REQUEST['bulk_action_product_ids'] // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		);

		// get all posts where the sc_id meta key is in the bundle ids using wp_query.
		$query = new \WP_Query(
			[
				'post_type'      => 'sc_product',
				'posts_per_page' => -1,
				'meta_query'     => [
					[
						'key'     => 'sc_id',
						'value'   => $bundle_ids,
						'compare' => 'IN',
					],
				],
			]
		);

		// handle error.
		if ( is_wp_error( $query ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $query->get_error_messages() ) ) );
		}

		// delete the posts.
		foreach ( $query->posts as $post ) {
			wp_delete_post( $post->ID, true );
		}

		// create bulk action — bundles are products under the hood.
		$action = \SureCart::bulkAction()->createBulkAction(
			'delete_products',
			$bundle_ids
		);

		// handle error.
		if ( is_wp_error( $action ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $action->get_error_messages() ) ) );
		}

		// redirect.
		return \SureCart::redirect()->to( esc_url_raw( admin_url( 'admin.php?page=sc-bundles' ) ) );
	}

	/**
	 * Edit a bundle.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 */
	public function edit( $request ) {
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( BundleScriptsController::class, 'enqueue' ) );

		// define bundle.
		$bundle = null;

		// find the bundle.
		if ( $request->query( 'id' ) ) {
			$bundle = Product::find( $request->query( 'id' ) );

			if ( is_wp_error( $bundle ) ) {
				wp_die( implode( ' ', array_map( 'esc_html', $bundle->get_error_messages() ) ) );
			}
		}

		// preload paths.
		if ( ! empty( $bundle ) ) {
			$gallery_paths = [];
			$gallery       = $bundle->gallery_ids ?? [];
			foreach ( $gallery as $gallery_item ) {
				$id = is_numeric( $gallery_item ) ? (int) $gallery_item : intval( ( (object) $gallery_item )->id ?? 0 );

				if ( $id > 0 ) {
					$gallery_paths[] = '/wp/v2/media/' . $id . '?context=edit';
				}
			}
			$taxonomies = array_diff( get_object_taxonomies( 'sc_product' ), array( 'sc_account', 'sc_collection' ) );

			if ( ! empty( $taxonomies ) ) {
				$taxonomy_paths = [];
				foreach ( $taxonomies as $taxonomy ) {
					$taxonomy_paths[] = '/wp/v2/taxonomies/' . $taxonomy . '?context=edit';
					$taxonomy_paths[] = '/wp/v2/' . $taxonomy;
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
						'/wp/v2/templates/' . $bundle->template_id . '?context=edit',
						'/wp/v2/template-parts/' . $bundle->template_part_id . '?context=edit',
						'/wp/v2/taxonomies?context=view',
						'/wp/v2/taxonomies?context=edit&per_page=100',
						'/wp/v2/sc_product?context=edit&sc_id[0]=' . $bundle->id . '&per_page=1&_locale=user',
						'/surecart/v1/products/' . $bundle->id . '?context=edit',
						'/surecart/v1/integrations?context=edit&model_ids[0]=' . $bundle->id . '&per_page=50',
						'/surecart/v1/integration_providers?context=edit',
						'/surecart/v1/integration_provider_items?context=edit',
					],
					$gallery_paths,
					$taxonomy_paths ?? []
				)
			);
		}

		// add bundle link.
		add_action(
			'admin_bar_menu',
			function ( $wp_admin_bar ) use ( $bundle ) {
				$wp_admin_bar->add_node(
					[
						'id'    => 'view-bundle-page',
						'title' => __( 'View Bundle', 'surecart' ),
						'href'  => esc_url( $bundle->permalink ?? '#' ),
						'meta'  => [
							'class' => empty( $bundle->permalink ) ? 'hidden' : '',
						],
					]
				);
			},
			99
		);

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
		$bundle = Product::find( $request->query( 'id' ) );

		if ( is_wp_error( $bundle ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $bundle->get_error_messages() ) ) );
		}

		$updated = $bundle->update(
			[
				'archived' => ! (bool) $bundle->archived,
			]
		);

		if ( is_wp_error( $updated ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $updated->get_error_messages() ) ) );
		}

		return \SureCart::redirect()->to(
			esc_url_raw(
				add_query_arg(
					$updated->archived ? [ 'archived' => 1 ] : [ 'unarchived' => 1 ],
					\SureCart::getUrl()->index( 'bundle' )
				)
			)
		);
	}

	/**
	 * Start bundle sync (re-sync all products on the API — bundles are products too).
	 *
	 * @return \SureCartCore\Responses\RedirectResponse
	 */
	public function syncAll() {
		// dispatch the sync job.
		\SureCart::sync()->products()->dispatch();

		// redirect to bundles page.
		return \SureCart::redirect()->to( esc_url_raw( \SureCart::getUrl()->index( 'bundle' ) ) );
	}

	/**
	 * Start bundle sync.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 *
	 * @return \SureCartCore\Responses\RedirectResponse
	 */
	public function sync( $request ) {
		$bundle = Product::sync( $request->query( 'id' ) );

		if ( is_wp_error( $bundle ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $bundle->get_error_messages() ) ) );
		}

		// redirect to bundles page.
		return \SureCart::redirect()->to(
			esc_url_raw(
				add_query_arg(
					[ 'sync_success' => true ],
					\SureCart::getUrl()->index( 'bundle' )
				)
			)
		);
	}

	/**
	 * Duplicate a bundle.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 *
	 * @return \SureCartCore\Responses\RedirectResponse
	 */
	public function duplicate( $request ) {
		$duplicated = Product::duplicate( $request->query( 'id' ) );

		if ( is_wp_error( $duplicated ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $duplicated->get_error_messages() ) ) );
		}

		return \SureCart::redirect()->to(
			esc_url_raw(
				add_query_arg(
					[
						'duplicated' => true,
					],
					\SureCart::getUrl()->index( 'bundle' )
				)
			)
		);
	}
}
