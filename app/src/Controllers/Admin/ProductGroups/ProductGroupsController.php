<?php

namespace SureCart\Controllers\Admin\ProductGroups;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Controllers\Admin\RendersEnhancedAdminView;

/**
 * Handles upgrade group (product group) admin requests.
 */
class ProductGroupsController extends AdminController {
	use RendersEnhancedAdminView;

	/**
	 * Render the legacy WP_List_Table view.
	 *
	 * @return \SureCartCore\Responses\ResponseInterface
	 */
	protected function renderWpListView() {
		$table = new ProductGroupsListTable();
		$table->prepare_items();

		$this->withHeader(
			array(
				'breadcrumbs'         => [
					'product-groups' => [
						'title' => __( 'Upgrade Groups', 'surecart' ),
					],
				],
				'enhanced_view_promo' => admin_url( 'admin.php?page=sc-product-groups' ),
			)
		);

		return \SureCart::view( 'admin/product-groups/index' )->with(
			[
				'table' => $table,
			]
		);
	}

	/**
	 * Render the SPA view for upgrade groups.
	 *
	 * @return \SureCartCore\Responses\ResponseInterface
	 */
	protected function renderSpaView() {
		$this->enqueueSpaScripts( ProductGroupsScriptsController::class );
		return $this->renderSpaShell(
			'admin/product-groups/spa',
			'product-groups',
			__( 'Upgrade Groups', 'surecart' )
		);
	}

	/**
	 * Edit / Create an upgrade group (SPA detail screen).
	 *
	 * Mounted on both `?action=edit` (with id → edit, without id → create) and
	 * `?action=show` (legacy alias that mapped to the read-only "view" route).
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 *
	 * @return \SureCartCore\Responses\ResponseInterface|string
	 */
	public function edit( $request ) {
		$this->enqueueSpaScripts( ProductGroupsScriptsController::class );

		$id = sanitize_text_field( wp_unslash( $request->query( 'id' ) ?? '' ) );

		$preload_paths = [
			'/wp/v2/users/me',
			'/wp/v2/types?context=view',
			'/wp/v2/types?context=edit',
		];

		if ( ! empty( $id ) ) {
			$preload_paths[] = '/surecart/v1/product_groups/' . $id . '?context=edit';
		}

		$this->preloadPaths( $preload_paths );

		return $this->renderSpaShell( 'admin/product-groups/spa' );
	}
}
