<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Checkout;
use SureCart\Models\Invoice;
use SureCart\Models\LineItem;

/**
 * Create a new invoice for a customer.
 */
class CreateInvoice extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/create-invoice';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Create Invoice', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Create a new SureCart invoice for a customer. Requires a customer ID, a price ID for the line item, and a due date. Optionally set a custom ad-hoc amount, quantity, and a memo/description. The invoice is created in draft status and then opened so the customer can pay.', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_annotations(): array {
		return array(
			'readonly'    => false,
			'destructive' => false,
			'idempotent'  => false,
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_instructions(): string {
		return 'This ability creates a full invoice in one step. It requires a customer_id and a price_id (use surecart/list-prices to find one). If the price has ad_hoc enabled, you can override the amount with ad_hoc_amount in smallest currency unit (e.g., 9999 for $99.99). A due_date in YYYY-MM-DD format is required. The invoice is created as a draft, populated with the line item and customer, then opened automatically. Each call creates a new invoice — do not call multiple times for the same invoice. Always confirm the details with the user before creating.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'publish_sc_invoices' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'customer_id'  => array(
					'type'        => 'string',
					'description' => __( 'The SureCart customer ID to invoice.', 'surecart' ),
				),
				'price_id'     => array(
					'type'        => 'string',
					'description' => __( 'The price ID to add as a line item. Use surecart/list-prices to find available prices.', 'surecart' ),
				),
				'due_date'     => array(
					'type'        => 'string',
					'description' => __( 'Due date in YYYY-MM-DD format.', 'surecart' ),
				),
				'ad_hoc_amount' => array(
					'type'        => 'integer',
					'description' => __( 'Custom amount in smallest currency unit (e.g., 9999 for $99.99). Only works with ad-hoc enabled prices.', 'surecart' ),
				),
				'quantity'     => array(
					'type'        => 'integer',
					'description' => __( 'Line item quantity. Defaults to 1.', 'surecart' ),
					'default'     => 1,
				),
				'description'  => array(
					'type'        => 'string',
					'description' => __( 'Invoice memo or description.', 'surecart' ),
				),
			),
			'required'   => array( 'customer_id', 'price_id', 'due_date' ),
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
		$customer_id = sanitize_text_field( $input['customer_id'] ?? '' );
		if ( empty( $customer_id ) ) {
			return $this->error( 'missing_customer_id', __( 'A customer ID is required.', 'surecart' ) );
		}

		$price_id = sanitize_text_field( $input['price_id'] ?? '' );
		if ( empty( $price_id ) ) {
			return $this->error( 'missing_price_id', __( 'A price ID is required.', 'surecart' ) );
		}

		$due_date = sanitize_text_field( $input['due_date'] ?? '' );
		if ( empty( $due_date ) ) {
			return $this->error( 'missing_due_date', __( 'A due date is required.', 'surecart' ) );
		}

		if ( ! $this->is_valid_date( $due_date ) ) {
			return $this->error( 'invalid_date', __( 'due_date must be in YYYY-MM-DD format.', 'surecart' ) );
		}

		$quantity = absint( $input['quantity'] ?? 1 );
		if ( $quantity < 1 ) {
			$quantity = 1;
		}

		// Step 1: Create a draft invoice.
		$invoice = Invoice::create(
			array(
				'live_mode' => true,
			)
		);

		if ( is_wp_error( $invoice ) ) {
			return $invoice;
		}

		$checkout_id = $invoice->checkout ?? '';
		if ( is_object( $checkout_id ) ) {
			$checkout_id = $checkout_id->id ?? '';
		}

		if ( empty( $checkout_id ) ) {
			return $this->error( 'no_checkout', __( 'Invoice was created but no associated checkout was found.', 'surecart' ) );
		}

		// Step 2: Update the checkout with the customer.
		// The admin UI uses customer_id (not customer) when patching the checkout.
		$checkout = Checkout::update(
			array(
				'id'          => $checkout_id,
				'customer_id' => $customer_id,
			)
		);

		if ( is_wp_error( $checkout ) ) {
			return $checkout;
		}

		// Step 3: Add a line item to the checkout.
		$line_item_data = array(
			'checkout' => $checkout_id,
			'price'    => $price_id,
			'quantity' => $quantity,
		);

		if ( ! empty( $input['ad_hoc_amount'] ) ) {
			$line_item_data['ad_hoc_amount'] = absint( $input['ad_hoc_amount'] );
		}

		$line_item = LineItem::create( $line_item_data );

		if ( is_wp_error( $line_item ) ) {
			return $line_item;
		}

		// Step 4: Update the invoice with due date and memo.
		$invoice_update_data = array(
			'id'       => $invoice->id,
			'due_date' => ( new \DateTime( $due_date ) )->getTimestamp(),
		);

		if ( ! empty( $input['description'] ) ) {
			$invoice_update_data['memo'] = sanitize_textarea_field( $input['description'] );
		}

		$updated_invoice = Invoice::update( $invoice_update_data );

		if ( is_wp_error( $updated_invoice ) ) {
			return $updated_invoice;
		}

		// Step 5: Open the invoice so the customer can pay.
		$opened_invoice = Invoice::with(
			array(
				'checkout',
				'checkout.line_items',
				'line_item.price',
				'price.product',
				'checkout.customer',
			)
		)->open( $updated_invoice->id );

		if ( is_wp_error( $opened_invoice ) ) {
			return $opened_invoice;
		}

		return $this->success(
			array(
				'invoice' => $this->model_to_array( $opened_invoice ),
			)
		);
	}
}
