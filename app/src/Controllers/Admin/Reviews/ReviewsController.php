<?php

namespace SureCart\Controllers\Admin\Reviews;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Controllers\Admin\RendersEnhancedAdminView;
use SureCart\Models\Review;
use SureCartVendors\Psr\Http\Message\ResponseInterface;

/**
 * Handle the reviews admin page.
 */
class ReviewsController extends AdminController {
	use RendersEnhancedAdminView;

	/**
	 * Render the legacy WP_List_Table view.
	 *
	 * @return \SureCartCore\Responses\ResponseInterface
	 */
	protected function renderWpListView() {
		$table = new ReviewsListTable();
		$table->prepare_items();

		$this->withHeader(
			array(
				'breadcrumbs'         => [
					'reviews' => [
						'title' => __( 'Product Reviews', 'surecart' ),
					],
				],
				'enhanced_view_promo' => admin_url( 'admin.php?page=sc-reviews' ),
			)
		);

		$this->withNotices(
			array(
				'published'   => __( 'Review approved.', 'surecart' ),
				'unpublished' => __( 'Review rejected.', 'surecart' ),
				'deleted'     => __( 'Review deleted.', 'surecart' ),
			)
		);

		return \SureCart::view( 'admin/reviews/index' )->with( [ 'table' => $table ] );
	}

	/**
	 * Render the SPA view for reviews.
	 *
	 * @return \SureCartCore\Responses\ResponseInterface
	 */
	protected function renderSpaView() {
		$this->enqueueSpaScripts( ReviewsScriptsController::class );
		return $this->renderSpaShell(
			'admin/reviews/spa',
			'reviews',
			__( 'Reviews', 'surecart' )
		);
	}

	/**
	 * Edit a review (SPA edit screen).
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 *
	 * @return \SureCartCore\Responses\ResponseInterface|string
	 */
	public function edit( $request ) {
		$id = sanitize_text_field( wp_unslash( $request->query( 'id' ) ?? '' ) );

		// No id — redirect to the list rather than wp_die.
		if ( ! $id ) {
			return \SureCart::redirect()->to( admin_url( 'admin.php?page=sc-reviews' ) );
		}

		$this->enqueueSpaScripts( ReviewsScriptsController::class );

		$this->preloadPaths(
			[
				'/wp/v2/users/me',
				'/wp/v2/types?context=view',
				'/wp/v2/types?context=edit',
				'/surecart/v1/reviews/' . $id . '?context=edit',
			]
		);

		return $this->renderSpaShell( 'admin/reviews/spa' );
	}

	/**
	 * Publish a review (legacy GET action — still used by the WP_List_Table row links).
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 *
	 * @return ResponseInterface
	 */
	public function publish( $request ): ResponseInterface {
		$published = Review::publish( sanitize_text_field( wp_unslash( $request->query( 'id' ) ) ) );

		if ( is_wp_error( $published ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $published->get_error_messages() ) ) );
		}

		return \SureCart::redirect()
			->to(
				add_query_arg(
					[ 'published' => true ],
					\SureCart::getUrl()->index( 'reviews' )
				)
			);
	}

	/**
	 * Unpublish a review (legacy GET action — still used by the WP_List_Table row links).
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 *
	 * @return ResponseInterface
	 */
	public function unpublish( $request ): ResponseInterface {
		$unpublished = Review::unpublish( sanitize_text_field( wp_unslash( $request->query( 'id' ) ) ) );

		if ( is_wp_error( $unpublished ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $unpublished->get_error_messages() ) ) );
		}

		return \SureCart::redirect()
			->to(
				add_query_arg(
					[ 'unpublished' => true ],
					\SureCart::getUrl()->index( 'reviews' )
				)
			);
	}

	/**
	 * Delete a review (legacy GET action — still used by the WP_List_Table row links).
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 *
	 * @return ResponseInterface
	 */
	public function delete( $request ): ResponseInterface {
		$deleted = Review::delete( sanitize_text_field( wp_unslash( $request->query( 'id' ) ) ) );

		if ( is_wp_error( $deleted ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $deleted->get_error_messages() ) ) );
		}

		return \SureCart::redirect()
			->to(
				add_query_arg(
					[ 'deleted' => true ],
					\SureCart::getUrl()->index( 'reviews' )
				)
			);
	}
}
