<?php

namespace SureCart\Controllers\Admin\Affiliations;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Controllers\Admin\Affiliations\AffiliationsListTable;
use SureCart\Models\Affiliation;

/**
 * Handles Affiliation admin routes.
 */
class AffiliationsController extends AdminController {
	/**
	 * Affiliates index.
	 */
	public function index() {
		$table = new AffiliationsListTable();
		$table->prepare_items();
		$this->withHeader(
			[
				'affiliates' => [
					'title' => __( 'Affiliates', 'surecart' ),
				],
			]
		);
		return \SureCart::view( 'admin/affiliations/index' )->with( [ 'table' => $table ] );
	}

	/**
	 * Edit
	 */
	public function edit( $request ) {
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( AffiliationsScriptsController::class, 'enqueue' ) );

		$this->preloadPaths(
			[
				'/wp/v2/users/me',
				'/wp/v2/types?context=view',
				'/wp/v2/types?context=edit',
				'/surecart/v1/affiliations/' . $request->query( 'id' ) . '?context=edit',
			]
		);

		// return view.
		return '<div id="app"></div>';
	}

	/**
	 * Activate the affiliation.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @return void
	 */
	public function activate( $request ) {
		$affiliation = Affiliation::find( $request->query( 'id' ) );

		if ( is_wp_error( $affiliation ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $affiliation->get_error_messages() ) ) );
		}

		$activated = $affiliation->activate( $request->query( 'id' ) );

		if ( is_wp_error( $activated ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $activated->get_error_messages() ) ) );
		}

		\SureCart::flash()->add(
			'success',
			__( 'Affiliate user activated.', 'surecart' )
		);

		return $this->redirectBack( $request );
	}

	/**
	 * De-activate the affiliation.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 * @return void
	 */
	public function deactivate( $request ) {
		$affiliation = Affiliation::find( $request->query( 'id' ) );

		if ( is_wp_error( $affiliation ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $affiliation->get_error_messages() ) ) );
		}

		$deactivated = $affiliation->deactivate( $request->query( 'id' ) );

		if ( is_wp_error( $deactivated ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $deactivated->get_error_messages() ) ) );
		}

		\SureCart::flash()->add(
			'success',
			__( 'Affiliate user deactivated.', 'surecart' )
		);

		return $this->redirectBack( $request );
	}
}
