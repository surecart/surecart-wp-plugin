<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Fulfillment;

/**
 * Create a fulfillment record for an order.
 */
class CreateFulfillment extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/create-fulfillment';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Create Fulfillment', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Create a new fulfillment record for a SureCart order. Includes tracking number, carrier, and fulfillment items specifying which line items and quantities are being fulfilled.', 'surecart' );
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
		return 'Requires an order ID. Include fulfillment_items to specify which line items and quantities are being fulfilled. Set tracking_number and tracking_carrier for shipment tracking. Each call creates a new fulfillment.';
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
				'order_id'              => array(
					'type'        => 'string',
					'description' => __( 'The order ID to fulfill.', 'surecart' ),
				),
				'shipment_status'       => array(
					'type'        => 'string',
					'description' => __( 'Initial shipment status: unshippable, unshipped, shipped, or delivered.', 'surecart' ),
				),
				'notifications_enabled' => array(
					'type'        => 'boolean',
					'description' => __( 'Whether to send customer notifications when this fulfillment is created and updated.', 'surecart' ),
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
								'description' => __( 'The line item ID to fulfill.', 'surecart' ),
							),
							'quantity'  => array(
								'type'        => 'integer',
								'description' => __( 'Quantity to fulfill. Must be less than or equal to the remaining unfulfilled quantity.', 'surecart' ),
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
			'required'   => array( 'order_id', 'shipment_status', 'fulfillment_items' ),
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
		$shipment_status = sanitize_text_field( $input['shipment_status'] ?? '' );
		if ( empty( $shipment_status ) ) {
			return $this->error( 'missing_shipment_status', __( 'Shipment status is required. Valid values: unshippable, unshipped, shipped, delivered.', 'surecart' ) );
		}

		$data = array(
			'order'           => sanitize_text_field( $input['order_id'] ),
			'shipment_status' => $shipment_status,
		);

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

		$fulfillment = Fulfillment::create( $data );
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
