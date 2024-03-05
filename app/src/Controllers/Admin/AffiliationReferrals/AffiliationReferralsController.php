<?php

namespace SureCart\Controllers\Admin\AffiliationReferrals;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Models\Referral;
use SureCartCore\Responses\RedirectResponse;

/**
 * Handles affiliate referrals admin routes.
 */
class AffiliationReferralsController extends AdminController {
	/**
	 * Affiliate Referral index.
	 */
	public function index() {
		$table = new AffiliationReferralsListTable();
		$table->prepare_items();
		$this->withHeader(
			[
				'affiliate_referrals' => [
					'title' => __( 'Affiliate Referrals', 'surecart' ),
				],
			]
		);
		return \SureCart::view( 'admin/affiliation-referrals/index' )->with( [ 'table' => $table ] );
	}

	/**
	 * Edit an affiliate referral.
	 *
	 * @param \SureCartCore\Http\Request $request Request object.
	 *
	 * @return string
	 */
	public function edit( $request ) {
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( AffiliationReferralsScriptsController::class, 'enqueue' ) );

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
	 * Delete an affiliate referral.
	 *
	 * @param \SureCartCore\Http\Request $request Request object.
	 *
	 * @return \SureCartCore\Responses\RedirectResponse
	 */
	public function delete( $request ) {
		$referral = Referral::find( $request->query( 'id' ) );

		if ( is_wp_error( $referral ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $referral->get_error_messages() ) ) );
		}

		$deleted = $referral->delete( $request->query( 'id' ) );

		if ( is_wp_error( $deleted ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $deleted->get_error_messages() ) ) );
		}

		\SureCart::flash()->add(
			'success',
			__( 'Affiliate referral deleted.', 'surecart' )
		);

		return $this->redirectBack( $request );

	}

	/**
	 * Approve an affiliate referral.
	 *
	 * @param \SureCartCore\Http\Request $request Request object.
	 *
	 * @return \SureCartCore\Responses\RedirectResponse
	 */
	public function approve( $request ) {
		$referral = Referral::find( $request->query( 'id' ) );

		if ( is_wp_error( $referral ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $referral->get_error_messages() ) ) );
		}

		$approved = $referral->approve( $request->query( 'id' ) );

		if ( is_wp_error( $approved ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $approved->get_error_messages() ) ) );
		}

		\SureCart::flash()->add(
			'success',
			__( 'Affiliate referral approved.', 'surecart' )
		);

		return $this->redirectBack( $request );
	}

	/**
	 * Deny an affiliate referral.
	 *
	 * @param \SureCartCore\Http\Request $request Request object.
	 *
	 * @return \SureCartCore\Responses\RedirectResponse
	 */
	public function deny( $request ) {
		$referral = Referral::find( $request->query( 'id' ) );

		if ( is_wp_error( $referral ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $referral->get_error_messages() ) ) );
		}

		$denied = $referral->deny( $request->query( 'id' ) );

		if ( is_wp_error( $denied ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $denied->get_error_messages() ) ) );
		}

		\SureCart::flash()->add(
			'success',
			__( 'Affiliate referral denied.', 'surecart' )
		);

		return $this->redirectBack( $request );
	}

	/**
	 * Make an affiliate referral reviewing.
	 *
	 * @param \SureCartCore\Http\Request $request Request object.
	 *
	 * @return \SureCartCore\Responses\RedirectResponse
	 */
	public function makeReviewing( $request ) {
		$referral = Referral::find( $request->query( 'id' ) );

		if ( is_wp_error( $referral ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $referral->get_error_messages() ) ) );
		}

		$reviewing = $referral->make_reviewing( $request->query( 'id' ) );

		if ( is_wp_error( $reviewing ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $reviewing->get_error_messages() ) ) );
		}

		\SureCart::flash()->add(
			'success',
			__( 'Affiliate referral is now in review.', 'surecart' )
		);

		return $this->redirectBack( $request );
	}
}
