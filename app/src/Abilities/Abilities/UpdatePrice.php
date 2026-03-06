<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Price;

/**
 * Update an existing price.
 */
class UpdatePrice extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/update-price';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Update Price', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Update an existing SureCart price by its ID. Supports changing the display name and archive status. The price amount and currency cannot be changed after creation.', 'surecart' );
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
		return 'Requires a valid price ID. Note that amount and currency cannot be changed after creation — create a new price instead if you need different pricing. Set archived=true to soft-delete a price.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'edit_sc_prices' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'id'       => array(
					'type'        => 'string',
					'description' => __( 'The price ID to update.', 'surecart' ),
				),
				'amount'   => array(
					'type'        => 'integer',
					'description' => __( 'New price amount in the smallest currency unit (e.g., cents).', 'surecart' ),
				),
				'name'     => array(
					'type'        => 'string',
					'description' => __( 'New display name for the price.', 'surecart' ),
				),
				'archived' => array(
					'type'        => 'boolean',
					'description' => __( 'Whether to archive this price.', 'surecart' ),
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
				'price'   => array( 'type' => 'object' ),
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
			return $this->error( 'missing_id', __( 'A price ID is required.', 'surecart' ) );
		}

		$data = array();

		if ( isset( $input['amount'] ) ) {
			$data['amount'] = intval( $input['amount'] );
			if ( $data['amount'] <= 0 ) {
				return $this->error( 'invalid_amount', __( 'Amount must be greater than zero.', 'surecart' ) );
			}
		}

		if ( ! empty( $input['name'] ) ) {
			$data['name'] = sanitize_text_field( $input['name'] );
		}

		if ( isset( $input['archived'] ) ) {
			$data['archived'] = (bool) $input['archived'];
		}

		if ( empty( $data ) ) {
			return $this->error( 'missing_fields', __( 'At least one field must be provided to update.', 'surecart' ) );
		}

		$price = ( new Price( $id ) )->update( $data );
		if ( is_wp_error( $price ) ) {
			return $price;
		}

		return $this->success(
			array(
				'price' => $this->model_to_array( $price ),
			)
		);
	}
}
