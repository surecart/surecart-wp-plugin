<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Order;

/**
 * Get a single order with line items.
 */
class GetOrder extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/get-order';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Get Order', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Get a single SureCart order by ID, including checkout and line item details.', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'read_sc_orders' );
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
					'description' => __( 'The order ID.', 'surecart' ),
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
				'order'   => array( 'type' => 'object' ),
			),
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function execute( array $input ): array {
		$order = Order::with( array( 'checkout', 'checkout.line_items' ) )->find( sanitize_text_field( $input['id'] ) );
		if ( is_wp_error( $order ) ) {
			return $this->error( $order->get_error_message() );
		}

		return $this->success(
			array(
				'order' => $this->model_to_array( $order ),
			)
		);
	}
}
