<?php

namespace SureCart\Controllers\Admin\AffiliationPayouts;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Models\Payout;

/**
 * Handles affiliate payout admin routes.
 */
class AffiliationPayoutsController extends AdminController {
	/**
	 * Affiliate Payout index.
	 */
	public function index() {
		$table = new AffiliationPayoutsListTable();
		$table->prepare_items();
		$this->withHeader(
			[
				'affiliate_payouts' => [
					'title' => __( 'Affiliate Payouts', 'surecart' ),
				],
			]
		);
		return \SureCart::view( 'admin/affiliation-payouts/index' )->with( [ 'table' => $table ] );
	}

	/**
	 * Edit an affiliate payout.
	 *
	 * @param \SureCartCore\Http\Request $request Request object.
	 *
	 * @return string
	 */
	public function edit( $request ) {
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( AffiliationPayoutsScriptsController::class, 'enqueue' ) );

		$this->preloadPaths(
			[
				'/wp/v2/users/me',
				'/wp/v2/types?context=view',
				'/wp/v2/types?context=edit',
				'/surecart/v1/affiliation_clicks/' . $request->query( 'id' ) . '?context=edit',
			]
		);

		// return view.
		return '<div id="app"></div>';
	}

	/**
	 * Delete an affiliate payout.
	 *
	 * @param \SureCartCore\Http\Request $request Request object.
	 *
	 * @return \SureCartCore\Responses\RedirectResponse
	 */
	public function delete( $request ) {
		$payout = Payout::find( $request->query( 'id' ) );

		if ( is_wp_error( $payout ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $payout->get_error_messages() ) ) );
		}

		$deleted = $payout->delete( $request->query( 'id' ) );

		if ( is_wp_error( $deleted ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $deleted->get_error_messages() ) ) );
		}

		\SureCart::flash()->add(
			'success',
			__( 'Affiliate payout deleted.', 'surecart' )
		);

		return $this->redirectBack( $request );

	}

	/**
	 * Complete an affiliate payout.
	 *
	 * @param \SureCartCore\Http\Request $request Request object.
	 *
	 * @return \SureCartCore\Responses\RedirectResponse
	 */
	public function complete( $request ) {
		$payout = Payout::find( $request->query( 'id' ) );

		if ( is_wp_error( $payout ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $payout->get_error_messages() ) ) );
		}

		$completed = $payout->complete( $request->query( 'id' ) );

		if ( is_wp_error( $completed ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $completed->get_error_messages() ) ) );
		}

		\SureCart::flash()->add(
			'success',
			__( 'Affiliate payout marked completed.', 'surecart' )
		);

		return $this->redirectBack( $request );
	}

	/**
	 * Make an affiliate payout processing.
	 *
	 * @param \SureCartCore\Http\Request $request Request object.
	 *
	 * @return \SureCartCore\Responses\RedirectResponse
	 */
	public function makeProcessing( $request ) {
		$payout = Payout::find( $request->query( 'id' ) );

		if ( is_wp_error( $payout ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $payout->get_error_messages() ) ) );
		}

		$processed = $payout->make_processing( $request->query( 'id' ) );

		if ( is_wp_error( $processed ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $processed->get_error_messages() ) ) );
		}

		\SureCart::flash()->add(
			'success',
			__( 'Affiliate payout marked processing.', 'surecart' )
		);

		return $this->redirectBack( $request );
	}
}
