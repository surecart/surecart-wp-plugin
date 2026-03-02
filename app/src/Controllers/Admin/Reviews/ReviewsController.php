<?php

namespace SureCart\Controllers\Admin\Reviews;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Models\Review;
use SureCartVendors\Psr\Http\Message\ResponseInterface;

/**
 * Handle the reviews admin page.
 */
class ReviewsController extends AdminController {
	/**
	 * Index.
	 *
	 * @return string
	 */
	public function index() {
		$table = new ReviewsListTable();
		$table->prepare_items();
		$this->withHeader(
			array(
				'breadcrumbs' => [
					'reviews' => [
						'title' => __( 'Product Reviews', 'surecart' ),
					],
				],
			)
		);

		// add notices.
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
	 * Edit.
	 *
	 * @return string
	 */
	public function edit() {
		$id = sanitize_text_field( wp_unslash( $_GET['id'] ?? '' ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		if ( ! $id ) {
			wp_die( esc_html__( 'Please provide a review id.', 'surecart' ) );
		}

		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( ReviewsScriptsController::class, 'enqueue' ) );

		$this->preloadPaths(
			[
				'/wp/v2/users/me',
				'/wp/v2/types?context=view',
				'/wp/v2/types?context=edit',
				'/surecart/v1/reviews/' . $id . '?context=edit',
			]
		);

		// return view.
		return '<div id="app"></div>';
	}

	/**
	 * Publish a review.
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
	 * Unpublish a review.
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
	 * Delete a review.
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
