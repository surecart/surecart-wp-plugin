<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Promotion;

/**
 * Delete a promotion.
 */
class DeletePromotion extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/delete-promotion';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Delete Promotion', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Permanently delete a SureCart promotion code by its ID. This removes the promotion code so it can no longer be used at checkout. Requires explicit confirmation. This action cannot be undone.', 'surecart' );
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
		return 'This is a permanently destructive action. Always warn the user and get explicit confirmation before proceeding. The confirm parameter must be set to true.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'delete_sc_promotions' );
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
					'description' => __( 'The promotion ID to delete.', 'surecart' ),
				),
				'confirm' => array(
					'type'        => 'boolean',
					'description' => __( 'Must be true to confirm deletion. Before setting this to true, warn the user: "Warning: Deleting this promotion will permanently remove the promotion code. This action cannot be undone. Are you sure you want to continue?"', 'surecart' ),
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
				__( 'Warning: Deleting this promotion will permanently remove the promotion code. This action cannot be undone. Please set confirm to true to proceed.', 'surecart' )
			);
		}

		$id = sanitize_text_field( $input['id'] ?? '' );
		if ( empty( $id ) ) {
			return $this->error( 'missing_id', __( 'A promotion ID is required.', 'surecart' ) );
		}

		$deleted = Promotion::delete( $id );
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
