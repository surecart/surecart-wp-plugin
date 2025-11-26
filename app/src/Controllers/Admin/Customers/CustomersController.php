<?php

namespace SureCart\Controllers\Admin\Customers;

use SureCart\Controllers\Admin\AdminController;
use SureCart\Models\Customer;
use SureCart\Controllers\Admin\Customers\CustomersListTable;
use SureCart\Background\BulkActionService;

/**
 * Handles product admin requests.
 */
class CustomersController extends AdminController {

	/**
	 * Customers index.
	 */
	public function index() {
		// instantiate the bulk actions service.
		$bulk_action_service = new BulkActionService();
		$bulk_action_service->bootstrap();

		// instantiate the customers list table.
		$table = new CustomersListTable( $bulk_action_service );
		$table->prepare_items();
		$this->withHeader(
			array(
				'breadcrumbs' => [
					'customers' => [
						'title' => __( 'Customers', 'surecart' ),
					],
				],
			)
		);
		return \SureCart::view( 'admin/customers/index' )->with( [ 'table' => $table ] );
	}

	/**
	 * Customers edit.
	 *
	 * @param \SureCartCore\Requests\RequestInterface $request Request.
	 */
	public function edit( $request ) {
		// enqueue needed script.
		add_action( 'admin_enqueue_scripts', \SureCart::closure()->method( CustomersScriptsController::class, 'enqueue' ) );

		$this->preloadPaths(
			[
				'/wp/v2/users/me',
				'/wp/v2/types?context=view',
				'/wp/v2/types?context=edit',
				'/surecart/v1/customers/' . $request->query( 'id' ) . '?context=edit&expand%5B0%5D=balances',
			]
		);

		// return view.
		return '<div id="app"></div>';
	}

	/**
	 * Confirm Bulk Delete.
	 */
	public function confirmBulkDelete() {
		// find the customers queued for bulk deletion.
		if ( empty( $_REQUEST['bulk_action_customer_ids'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			wp_die(
				sprintf(
					'%s <a href="%s">%s</a>',
					esc_html__( 'No customers selected. Please choose at least one customer to delete.', 'surecart' ),
					esc_url( admin_url( 'admin.php?page=sc-customers' ) ),
					esc_html__( 'Go Back', 'surecart' )
				)
			);
		}

		$customers = Customer::where(
			[
				'ids' => array_map( 'esc_html', $_REQUEST['bulk_action_customer_ids'] ), // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			]
		)->get();

		// handle empty.
		if ( empty( $customers ) ) {
			wp_die( esc_html( _n( 'This customer has already been deleted.', 'These customers have already been deleted.', count( $_REQUEST['bulk_action_customer_ids'] ), 'surecart' ) ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		}

		// handle error.
		if ( is_wp_error( $customers ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $customers->get_error_messages() ) ) );
		}

		// add header.
		$this->withHeader(
			[
				'delete' => [
					'title' => _n( 'Delete Customer', 'Delete Customers.', count( $customers ), 'surecart' ),
				],
			],
		);

		// return view.
		return \SureCart::view( 'admin/customers/confirm-bulk-delete' )->with( [ 'customers' => $customers ] );
	}

	/**
	 * Bulk Delete.
	 */
	public function bulkDelete() {
		$customer_ids = array_map(
			'sanitize_text_field',
			$_REQUEST['bulk_action_customer_ids'] // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		);

		// create bulk action.
		$action = \SureCart::bulkAction()->createBulkAction(
			'delete_customers',
			$customer_ids
		);

		// handle error.
		if ( is_wp_error( $action ) ) {
			wp_die( implode( ' ', array_map( 'esc_html', $action->get_error_messages() ) ) );
		}

		// redirect.
		return \SureCart::redirect()->to( esc_url_raw( admin_url( 'admin.php?page=sc-customers' ) ) );
	}
}
