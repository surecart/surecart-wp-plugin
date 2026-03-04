<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Fulfillment;

/**
 * Get a single fulfillment by ID.
 */
class GetFulfillment extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/get-fulfillment';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Get Fulfillment', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Get a single SureCart fulfillment by ID, including its fulfillment items and trackings.', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'edit_sc_orders' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'id' => array(
					'type'        => 'string',
					'description' => __( 'The fulfillment ID.', 'surecart' ),
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
				'success'     => array( 'type' => 'boolean' ),
				'fulfillment' => array( 'type' => 'object' ),
			),
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function execute( array $input ) {
		$id = sanitize_text_field( $input['id'] ?? '' );
		if ( empty( $id ) ) {
			return $this->error( 'missing_id', __( 'A fulfillment ID is required.', 'surecart' ) );
		}

		$fulfillment = Fulfillment::with( array( 'fulfillment_items', 'trackings' ) )->find( $id );
		if ( is_wp_error( $fulfillment ) ) {
			return $fulfillment;
		}

		return $this->success(
			array(
				'fulfillment' => $this->model_to_array( $fulfillment ),
			)
		);
	}
}
