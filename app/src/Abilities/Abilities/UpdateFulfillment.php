<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Fulfillment;

/**
 * Update an existing fulfillment.
 */
class UpdateFulfillment extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/update-fulfillment';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Update Fulfillment', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Update an existing SureCart fulfillment by its ID. Supports changing the shipment status, tracking information, and fulfillment items.', 'surecart' );
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
		return 'Requires a valid fulfillment ID. Use this to update tracking numbers, change shipment status, or modify fulfillment items. Only include the fields you want to change.';
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
				'id'                    => array(
					'type'        => 'string',
					'description' => __( 'The fulfillment ID to update.', 'surecart' ),
				),
				'shipment_status'       => array(
					'type'        => 'string',
					'description' => __( 'Shipment status: unshippable, unshipped, shipped, or delivered.', 'surecart' ),
				),
				'notifications_enabled' => array(
					'type'        => 'boolean',
					'description' => __( 'Whether to send customer notifications when fulfillments are created and updated.', 'surecart' ),
				),
				'trackings'             => array(
					'type'        => 'array',
					'items'       => array(
						'type'       => 'object',
						'properties' => array(
							'number' => array(
								'type'        => 'string',
								'description' => __( 'Tracking number.', 'surecart' ),
							),
							'url'    => array(
								'type'        => 'string',
								'description' => __( 'Tracking URL.', 'surecart' ),
							),
						),
					),
					'description' => __( 'Array of tracking objects with number and optional url.', 'surecart' ),
				),
				'fulfillment_items'     => array(
					'type'        => 'array',
					'items'       => array(
						'type'       => 'object',
						'properties' => array(
							'line_item' => array(
								'type'        => 'string',
								'description' => __( 'The line item ID.', 'surecart' ),
							),
							'quantity'  => array(
								'type'        => 'integer',
								'description' => __( 'Quantity to fulfill.', 'surecart' ),
							),
						),
					),
					'description' => __( 'Array of fulfillment items with line_item ID and quantity.', 'surecart' ),
				),
				'metadata'              => array(
					'type'        => 'object',
					'description' => __( 'Set of key-value pairs to attach to the fulfillment.', 'surecart' ),
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

		$data = array( 'id' => $id );

		if ( ! empty( $input['shipment_status'] ) ) {
			$data['shipment_status'] = sanitize_text_field( $input['shipment_status'] );
		}

		if ( isset( $input['notifications_enabled'] ) ) {
			$data['notifications_enabled'] = (bool) $input['notifications_enabled'];
		}

		if ( ! empty( $input['trackings'] ) ) {
			$trackings = $this->parse_json_or_array( $input['trackings'] );
			if ( null !== $trackings ) {
				$data['trackings'] = array_map(
					function ( $tracking ) {
						$item = array();
						if ( ! empty( $tracking['number'] ) ) {
							$item['number'] = sanitize_text_field( $tracking['number'] );
						}
						if ( ! empty( $tracking['url'] ) ) {
							$item['url'] = esc_url_raw( $tracking['url'] );
						}
						return $item;
					},
					$trackings
				);
			}
		}

		if ( ! empty( $input['fulfillment_items'] ) ) {
			$items = $this->parse_json_or_array( $input['fulfillment_items'] );
			if ( null !== $items ) {
				$data['fulfillment_items'] = array_map(
					function ( $item ) {
						$fulfillment_item = array();
						if ( ! empty( $item['line_item'] ) ) {
							$fulfillment_item['line_item'] = sanitize_text_field( $item['line_item'] );
						}
						if ( isset( $item['quantity'] ) ) {
							$fulfillment_item['quantity'] = absint( $item['quantity'] );
						}
						return $fulfillment_item;
					},
					$items
				);
			}
		}

		if ( ! empty( $input['metadata'] ) ) {
			$metadata = $this->parse_json_or_array( $input['metadata'] );
			if ( null !== $metadata ) {
				$data['metadata'] = array_map( 'sanitize_text_field', $metadata );
			}
		}

		$fulfillment = Fulfillment::update( $data );
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
