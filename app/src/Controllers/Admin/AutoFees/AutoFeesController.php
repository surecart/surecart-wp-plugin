<?php

namespace SureCart\Controllers\Admin\AutoFees;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Controllers\Admin\AutoFees\AutoFeesListTable;
use SureCart\Controllers\Admin\AutoFees\AutoFeesScriptsController;
use SureCart\Models\AutoFee;

/**
 * Handles product admin requests.
 */
class AutoFeesController extends AdminController {
	/**
	 * Orders index.
	 */
	public function index() {
		$table = new AutoFeesListTable();
		$table->prepare_items();
		$this->withHeader(
			array(
				'breadcrumbs' => [
					'auto_fee' => [
						'title' => __( 'Dynamic Pricing', 'surecart' ),
					],
				],
			)
		);

		return \SureCart::view( 'admin/auto-fees/index' )->with(
			[
				'table' => $table,
			]
		);
	}

	/**
	 * Edit
	 *
	 * @return string
	 */
	public function edit( $request ) {
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( AutoFeesScriptsController::class, 'enqueue' ) );

		$this->preloadPaths(
			[
				'/wp/v2/users/me',
				'/wp/v2/types?context=view',
				'/wp/v2/types?context=edit',
				'/surecart/v1/auto_fees/' . $request->query( 'id' ) . '?context=edit',
			]
		);

		// return view.
		return '<div id="app"></div>';
	}

	/**
	 * Change the active state od the model.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 *
	 * @return \SureCartCore\Responses\RedirectResponse
	 */
	public function toggleActive( $request ) {
		$auto_fee = AutoFee::find( $request->query( 'id' ) );
		$status   = $request->query( 'status' ) ?? 'active';

		if ( is_wp_error( $auto_fee ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $auto_fee->get_error_messages() ) ) );
		}

		$updated = $auto_fee->update(
			[
				'enabled' => ! (bool) $auto_fee->enabled,
			]
		);

		if ( is_wp_error( $updated ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $updated->get_error_messages() ) ) );
		}

		\SureCart::flash()->add(
			'success',
			$updated->active ? __( 'Dynamic Price enabled.', 'surecart' ) : __( 'Dynamic Price disabled.', 'surecart' )
		);

		return \SureCart::redirect()->to(
			esc_url_raw( add_query_arg( 'status', $status, admin_url( 'admin.php?page=sc-auto-fees' ) ) )
		);
	}
}
