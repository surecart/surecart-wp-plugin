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
		return __( 'Update an existing price. Change amount, name, or archive it.', 'surecart' );
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
	 */
	public function execute( array $input ): array {
		$id   = sanitize_text_field( $input['id'] );
		$data = array();

		if ( isset( $input['amount'] ) ) {
			$data['amount'] = absint( $input['amount'] );
		}

		if ( ! empty( $input['name'] ) ) {
			$data['name'] = sanitize_text_field( $input['name'] );
		}

		if ( isset( $input['archived'] ) ) {
			$data['archived'] = (bool) $input['archived'];
		}

		$price = Price::update( $id, $data );
		if ( is_wp_error( $price ) ) {
			return $this->error( $price->get_error_message() );
		}

		return $this->success(
			array(
				'price' => $this->model_to_array( $price ),
			)
		);
	}
}
