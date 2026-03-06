<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Coupon;

/**
 * Delete a coupon.
 */
class DeleteCoupon extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/delete-coupon';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Delete Coupon', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Permanently delete a SureCart coupon by its ID. This removes the coupon and all associated promotion codes. Requires explicit confirmation. This action cannot be undone.', 'surecart' );
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
		return 'This is a permanently destructive action. Always warn the user and get explicit confirmation before proceeding. The confirm parameter must be set to true. Deleting a coupon also removes all associated promotion codes.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'delete_sc_coupons' );
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
					'description' => __( 'The coupon ID to delete.', 'surecart' ),
				),
				'confirm' => array(
					'type'        => 'boolean',
					'description' => __( 'Must be true to confirm deletion. Before setting this to true, warn the user: "Warning: Deleting this coupon will permanently remove it and all associated promotions. This action cannot be undone. Are you sure you want to continue?"', 'surecart' ),
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
				__( 'Warning: Deleting this coupon will permanently remove it and all associated promotions. This action cannot be undone. Please set confirm to true to proceed.', 'surecart' )
			);
		}

		$id = sanitize_text_field( $input['id'] ?? '' );
		if ( empty( $id ) ) {
			return $this->error( 'missing_id', __( 'A coupon ID is required.', 'surecart' ) );
		}

		$deleted = Coupon::delete( $id );
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
