<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Customer;

/**
 * Delete a customer.
 */
class DeleteCustomer extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/delete-customer';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Delete Customer', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Permanently delete a SureCart customer by their ID. All associated subscriptions, payments, and purchase records will be permanently removed within 24 hours. Requires explicit confirmation. This action cannot be undone.', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_annotations(): array {
		return array(
			'readonly'    => false,
			'destructive' => true,
			'idempotent'  => true,
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_instructions(): string {
		return 'This is a permanently destructive action. All associated subscriptions, payments, and purchase records will be permanently removed within 24 hours. Always warn the user and get explicit confirmation before proceeding. The confirm parameter must be set to true.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'delete_sc_customers' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'id'      => array(
					'type'        => 'string',
					'description' => __( 'The customer ID to delete.', 'surecart' ),
				),
				'confirm' => array(
					'type'        => 'boolean',
					'description' => __( 'Must be true to confirm deletion. Before setting this to true, warn the user: "Warning: Deleting this customer will permanently remove all associated subscriptions, payments, and purchases within 24 hours. This action cannot be undone. Are you sure you want to continue?"', 'surecart' ),
				),
			),
			'required'   => array( 'id', 'confirm' ),
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
				'id'      => array( 'type' => 'string' ),
			),
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function execute( array $input ) {
		if ( empty( $input['confirm'] ) ) {
			return $this->error(
				'confirmation_required',
				__( 'Warning: Deleting this customer will permanently remove all associated subscriptions, payments, and purchases within 24 hours. This action cannot be undone. Please set confirm to true to proceed.', 'surecart' )
			);
		}

		$id = sanitize_text_field( $input['id'] ?? '' );
		if ( empty( $id ) ) {
			return $this->error( 'missing_id', __( 'A customer ID is required.', 'surecart' ) );
		}

		$deleted = Customer::delete( $id );
		if ( is_wp_error( $deleted ) ) {
			return $deleted;
		}

		return $this->success(
			array(
				'id' => $id,
			)
		);
	}
}
