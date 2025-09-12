<?php

namespace SureCart\Controllers\Admin\Reviews;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Models\Review;

/**
 * Handle the reviews admin page.
 */
class ReviewsController extends AdminController {
	/**
	 * Index.
	 *
	 * @return function
	 */
	public function index() {
		// Handle bulk actions and individual actions.
		$this->handleActions();

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
		return \SureCart::view( 'admin/reviews/index' )->with( [ 'table' => $table ] );
	}

	/**
	 * Handle actions.
	 *
	 * @return void
	 */
	protected function handleActions() {
		if ( empty( $_GET['action'] ) || empty( $_GET['id'] ) ) {
			return;
		}

		$action = sanitize_text_field( wp_unslash( $_GET['action'] ) );
		$id     = sanitize_text_field( wp_unslash( $_GET['id'] ) );

		switch ( $action ) {
			case 'publish':
				if ( ! wp_verify_nonce( $_GET['_wpnonce'] ?? '', 'publish_review' ) ) {
					wp_die( esc_html__( 'Security check failed.', 'surecart' ) );
				}
				$this->publish();
				break;
			case 'unpublish':
				if ( ! wp_verify_nonce( $_GET['_wpnonce'] ?? '', 'unpublish_review' ) ) {
					wp_die( esc_html__( 'Security check failed.', 'surecart' ) );
				}
				$this->unpublish();
				break;
			case 'delete':
				if ( ! wp_verify_nonce( $_GET['_wpnonce'] ?? '', 'delete_review' ) ) {
					wp_die( esc_html__( 'Security check failed.', 'surecart' ) );
				}
				$this->delete();
				break;
		}
	}

	/**
	 * Edit.
	 *
	 * @return function
	 */
	public function edit() {
		$id = sanitize_text_field( wp_unslash( $_GET['id'] ?? '' ) );
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
	 * @return void
	 */
	public function publish() {
		$id = sanitize_text_field( wp_unslash( $_GET['id'] ?? '' ) );
		if ( ! $id ) {
			wp_die( esc_html__( 'Please provide a review id.', 'surecart' ) );
		}

		$review = Review::find( $id );
		if ( is_wp_error( $review ) ) {
			wp_die( esc_html( $review->get_error_message() ) );
		}

		$published = $review->publish();
		if ( is_wp_error( $published ) ) {
			wp_die( esc_html( $published->get_error_message() ) );
		}

		wp_safe_redirect(
			esc_url_raw(
				add_query_arg(
					[
						'action' => 'edit',
						'id'     => $id,
					],
					admin_url( 'admin.php?page=sc-reviews' )
				)
			)
		);
		exit;
	}

	/**
	 * Unpublish a review.
	 *
	 * @return void
	 */
	public function unpublish() {
		$id = sanitize_text_field( wp_unslash( $_GET['id'] ?? '' ) );
		if ( ! $id ) {
			wp_die( esc_html__( 'Please provide a review id.', 'surecart' ) );
		}

		$review = Review::find( $id );
		if ( is_wp_error( $review ) ) {
			wp_die( esc_html( $review->get_error_message() ) );
		}

		$unpublished = $review->unpublish();
		if ( is_wp_error( $unpublished ) ) {
			wp_die( esc_html( $unpublished->get_error_message() ) );
		}

		wp_safe_redirect(
			esc_url_raw(
				add_query_arg(
					[
						'action' => 'edit',
						'id'     => $id,
					],
					admin_url( 'admin.php?page=sc-reviews' )
				)
			)
		);
		exit;
	}

	/**
	 * Delete a review.
	 *
	 * @return void
	 */
	public function delete() {
		$id = sanitize_text_field( wp_unslash( $_GET['id'] ?? '' ) );
		if ( ! $id ) {
			wp_die( esc_html__( 'Please provide a review id.', 'surecart' ) );
		}

		$review = Review::find( $id );
		if ( is_wp_error( $review ) ) {
			wp_die( esc_html( $review->get_error_message() ) );
		}

		$deleted = $review->delete();
		if ( is_wp_error( $deleted ) ) {
			wp_die( esc_html( $deleted->get_error_message() ) );
		}

		wp_safe_redirect(
			esc_url_raw(
				admin_url( 'admin.php?page=sc-reviews' )
			)
		);
		exit;
	}
}
