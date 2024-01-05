<?php

namespace SureCart\Controllers\Admin\Upsells;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Models\Product;
use SureCart\Models\Upsell;
use SureCartCore\Responses\RedirectResponse;

/**
 * Handles upsell admin requests.
 */
class UpsellsController extends AdminController {

	/**
	 * Bumps index.
	 */
	public function index() {
		$table = new UpsellsListTable();
		$table->prepare_items();
		$this->withHeader(
			[
				'upsells' => [
					'title' => __( 'Upsells', 'surecart' ),
				],
			]
		);
		return \SureCart::view( 'admin/upsells/index' )->with( [ 'table' => $table ] );
	}

	/**
	 * Edit
	 */
	public function edit( $request ) {
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( UpsellScriptsController::class, 'enqueue' ) );

		$upsell = null;

		if ( $request->query( 'id' ) ) {
			$upsell = Upsell::with( [ 'price' ] )->find( $request->query( 'id' ) );

			if ( is_wp_error( $upsell ) ) {
				wp_die( implode( ' ', array_map( 'esc_html', $upsell->get_error_messages() ) ) );
			}
		}

		$this->preloadPaths(
			[
				'/wp/v2/users/me',
				'/wp/v2/types?context=view',
				'/wp/v2/types?context=edit',
				'/surecart/v1/upsells/' . $request->query( 'id' ) . '?context=edit',
			]
		);

		// Add View Upsell link.
		add_action(
			'admin_bar_menu',
			function( $wp_admin_bar ) use ( $upsell ) {
				$wp_admin_bar->add_node(
					[
						'id'    => 'view-upsell-page',
						'title' => __( 'View Upsell', 'surecart' ),
						'href'  => esc_url( $upsell->permalink ?? '#' ),
						'meta'  => [
							'class' => empty( $upsell->permalink ) ? 'hidden' : '',
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
