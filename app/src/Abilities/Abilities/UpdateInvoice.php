<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Invoice;

/**
 * Update an existing invoice.
 */
class UpdateInvoice extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/update-invoice';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Update Invoice', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Update an existing SureCart invoice. Can modify the due date, issue date, memo, footer, and email notification preference. Can also change the invoice status to "open" (sends to customer) or "draft" (reverts to editable). When opening, use notifications_enabled to control whether the customer receives an email.', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_annotations(): array {
		return array(
			'readonly'    => false,
			'destructive' => false,
			'idempotent'  => true,
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_instructions(): string {
		return 'Use this to update invoice properties like due_date, memo, footer, or to change its status. To send an invoice to a customer, set status to "open" — the customer will receive an email if notifications_enabled is true (default). To revert an invoice back to editable, set status to "draft". Only draft invoices can have their properties edited. The notifications_enabled flag controls whether the customer is emailed when the invoice is opened. Always confirm with the user before opening an invoice, as it initiates a payment request.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'edit_sc_invoices' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'id'                    => array(
					'type'        => 'string',
					'description' => __( 'The invoice ID to update.', 'surecart' ),
				),
				'due_date'              => array(
					'type'        => 'string',
					'description' => __( 'Due date in YYYY-MM-DD format. Set to empty string to clear.', 'surecart' ),
				),
				'issue_date'            => array(
					'type'        => 'string',
					'description' => __( 'Issue date in YYYY-MM-DD format. Set to empty string to clear.', 'surecart' ),
				),
				'memo'                  => array(
					'type'        => 'string',
					'description' => __( 'Invoice memo. Appears on the payment page, invoices, and receipts.', 'surecart' ),
				),
				'footer'                => array(
					'type'        => 'string',
					'description' => __( 'Invoice footer. Appears at the bottom of invoices and receipts.', 'surecart' ),
				),
				'notifications_enabled' => array(
					'type'        => 'boolean',
					'description' => __( 'Whether to send an email notification to the customer. Applies when opening the invoice.', 'surecart' ),
				),
				'status'                => array(
					'type'        => 'string',
					'description' => __( 'Change invoice status: "open" to send to the customer, "draft" to revert to editable.', 'surecart' ),
					'enum'        => array( 'open', 'draft' ),
				),
			),
			'required'   => array( 'id' ),
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_output_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'success' => array( 'type' => 'boolean' ),
				'invoice' => array( 'type' => 'object' ),
			),
		);
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param array $input The input data.
	 */
	public function execute( array $input ) {
		$id = sanitize_text_field( $input['id'] ?? '' );
		if ( empty( $id ) ) {
			return $this->error( 'missing_id', __( 'An invoice ID is required.', 'surecart' ) );
		}

		// Build the update data from provided fields.
		$data = array( 'id' => $id );

		// Handle due_date.
		if ( array_key_exists( 'due_date', $input ) ) {
			if ( empty( $input['due_date'] ) ) {
				$data['due_date'] = null;
			} else {
				$due_date = sanitize_text_field( $input['due_date'] );
				if ( ! $this->is_valid_date( $due_date ) ) {
					return $this->error( 'invalid_date', __( 'due_date must be in YYYY-MM-DD format.', 'surecart' ) );
				}
				$data['due_date'] = ( new \DateTime( $due_date ) )->getTimestamp();
			}
		}

		// Handle issue_date.
		if ( array_key_exists( 'issue_date', $input ) ) {
			if ( empty( $input['issue_date'] ) ) {
				$data['issue_date'] = null;
			} else {
				$issue_date = sanitize_text_field( $input['issue_date'] );
				if ( ! $this->is_valid_date( $issue_date ) ) {
					return $this->error( 'invalid_date', __( 'issue_date must be in YYYY-MM-DD format.', 'surecart' ) );
				}
				$data['issue_date'] = ( new \DateTime( $issue_date ) )->getTimestamp();
			}
		}

		// Handle memo.
		if ( array_key_exists( 'memo', $input ) ) {
			$data['memo'] = sanitize_textarea_field( $input['memo'] );
		}

		// Handle footer.
		if ( array_key_exists( 'footer', $input ) ) {
			$data['footer'] = sanitize_textarea_field( $input['footer'] );
		}

		// Handle notifications_enabled.
		if ( isset( $input['notifications_enabled'] ) ) {
			$data['notifications_enabled'] = (bool) $input['notifications_enabled'];
		}

		// Step 1: Update invoice properties if there are fields to update beyond id and status.
		$has_property_updates = count( array_diff_key( $data, array_flip( array( 'id' ) ) ) ) > 0;

		if ( $has_property_updates ) {
			$updated = Invoice::update( $data );
			if ( is_wp_error( $updated ) ) {
				return $updated;
			}
		}

		// Step 2: Handle status changes.
		$status = ! empty( $input['status'] ) ? sanitize_text_field( $input['status'] ) : '';

		if ( 'open' === $status ) {
			// Open the invoice — this is how the admin sends it to the customer.
			// notifications_enabled is already saved on the invoice from Step 1 above.
			$opened = Invoice::with(
				array(
					'checkout',
					'checkout.line_items',
					'line_item.price',
					'price.product',
					'checkout.customer',
				)
			)->open( $id );

			if ( is_wp_error( $opened ) ) {
				return $opened;
			}

			return $this->success(
				array(
					'invoice' => $this->model_to_array( $opened ),
				)
			);
		}

		if ( 'draft' === $status ) {
			// Revert to draft — matches admin's makeDraftRequest.
			$drafted = Invoice::with(
				array(
					'checkout',
					'checkout.line_items',
					'line_item.price',
					'price.product',
					'checkout.customer',
				)
			)->makeDraft( $id );

			if ( is_wp_error( $drafted ) ) {
				return $drafted;
			}

			return $this->success(
				array(
					'invoice' => $this->model_to_array( $drafted ),
				)
			);
		}

		// No status change — return the updated invoice.
		$invoice = Invoice::with(
			array(
				'checkout',
				'checkout.line_items',
				'line_item.price',
				'price.product',
				'checkout.customer',
			)
		)->find( $id );

		if ( is_wp_error( $invoice ) ) {
			return $invoice;
		}

		return $this->success(
			array(
				'invoice' => $this->model_to_array( $invoice ),
			)
		);
	}
}
