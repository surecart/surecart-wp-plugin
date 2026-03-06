<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\FulfillmentItem;

/**
 * Get a single fulfillment item by ID.
 */
class GetFulfillmentItem extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/get-fulfillment-item';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Get Fulfillment Item', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Retrieve a single SureCart fulfillment item by its ID, including the parent fulfillment and associated line item. Returns the fulfillment item with related data expanded.', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_annotations(): array {
		return array(
			'readonly'    => true,
			'destructive' => false,
			'idempotent'  => true,
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_instructions(): string {
		return 'Use this when you need details about a specific item within a fulfillment, including its quantity and associated line item.';
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
					'description' => __( 'The fulfillment item ID.', 'surecart' ),
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
				'success'          => array( 'type' => 'boolean' ),
				'fulfillment_item' => array( 'type' => 'object' ),
			),
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function execute( array $input ) {
		$id = sanitize_text_field( $input['id'] ?? '' );
		if ( empty( $id ) ) {
			return $this->error( 'missing_id', __( 'A fulfillment item ID is required.', 'surecart' ) );
		}

		$fulfillment_item = FulfillmentItem::with( array( 'fulfillment', 'line_item' ) )->find( $id );
		if ( is_wp_error( $fulfillment_item ) ) {
			return $fulfillment_item;
		}

		return $this->success(
			array(
				'fulfillment_item' => $this->model_to_array( $fulfillment_item ),
			)
		);
	}
}
