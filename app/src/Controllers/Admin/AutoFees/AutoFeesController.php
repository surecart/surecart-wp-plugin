<?php

namespace SureCart\Controllers\Admin\AutoFees;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Controllers\Admin\AutoFees\AutoFeesListTable;
use SureCart\Controllers\Admin\AutoFees\AutoFeesScriptsController;
use SureCart\Models\AutoFee;

/**
 * Handles auto fees admin requests.
 */
class AutoFeesController extends AdminController {
	/**
	 * Auto Fees index.
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

		\SureCart::notices()->add(
			[
				'name'  => 'auto_fees_getting_started',
				'type'  => 'info',
				'title' => esc_html__( 'What is dynamic pricing?', 'surecart' ),
				'text'  => sprintf(
					'<p>%s</p> <p><a href="%s" target="_blank" rel="noopener noreferrer">%s</a></p>',
					__( 'Dynamic pricing allows you to automatically discount or add fees to your products in checkout based on a variety of factors. Some popular use cases include "buy one, get one free" discounts, free shipping minimums, subscription renewal discounts. Get started by creating your first dynamic price.', 'surecart' ),
					'https://surecart.com/docs/dynamic-pricing/',
					__( 'Learn More ↗', 'surecart' )
				),
			]
		);

		$this->withNotices(
			array(
				'deleted' => __( 'Dynamic Price deleted.', 'surecart' ),
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
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
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
	 * Change the active state of the model.
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
			esc_url_raw( add_query_arg( [ 'status' => $status ], \SureCart::getUrl()->index( 'auto-fees' ) ) )
		);
	}

	/**
	 * Delete a dynamic price.
	 *
	 * @param \SureCartCore\Http\Request $request Request object.
	 *
	 * @return \SureCartCore\Responses\RedirectResponse
	 */
	public function delete( $request ) {
		$deleted = AutoFee::delete( $request->query( 'id' ) );

		if ( is_wp_error( $deleted ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $deleted->get_error_messages() ) ) );
		}

		return \SureCart::redirect()->to(
			esc_url_raw( add_query_arg( [ 'deleted' => true ], \SureCart::getUrl()->index( 'auto-fees' ) ) )
		);
	}
}
