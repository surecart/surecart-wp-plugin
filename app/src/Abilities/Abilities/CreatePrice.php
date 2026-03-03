<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Price;

/**
 * Create a new price for a product.
 */
class CreatePrice extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/create-price';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Create Price', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Create a new price for an existing product. Specify amount in smallest currency unit.', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'publish_sc_prices' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'product'                  => array(
					'type'        => 'string',
					'description' => __( 'The product ID to attach this price to.', 'surecart' ),
				),
				'amount'                   => array(
					'type'        => 'integer',
					'description' => __( 'Price amount in the smallest currency unit (e.g., cents).', 'surecart' ),
				),
				'currency'                 => array(
					'type'        => 'string',
					'description' => __( 'Three-letter ISO currency code (e.g., usd).', 'surecart' ),
				),
				'recurring_interval'       => array(
					'type'        => 'string',
					'description' => __( 'Billing interval for recurring prices.', 'surecart' ),
					'enum'        => array( 'day', 'week', 'month', 'year' ),
				),
				'recurring_interval_count' => array(
					'type'        => 'integer',
					'description' => __( 'Number of intervals between each billing cycle.', 'surecart' ),
				),
				'name'                     => array(
					'type'        => 'string',
					'description' => __( 'Display name for the price.', 'surecart' ),
				),
			),
			'required'   => array( 'product', 'amount', 'currency' ),
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
		$data = array(
			'product'  => sanitize_text_field( $input['product'] ),
			'amount'   => absint( $input['amount'] ),
			'currency' => sanitize_text_field( $input['currency'] ),
		);

		if ( ! empty( $input['recurring_interval'] ) ) {
			$data['recurring_interval'] = sanitize_text_field( $input['recurring_interval'] );
		}

		if ( ! empty( $input['recurring_interval_count'] ) ) {
			$data['recurring_interval_count'] = absint( $input['recurring_interval_count'] );
		}

		if ( ! empty( $input['name'] ) ) {
			$data['name'] = sanitize_text_field( $input['name'] );
		}

		$price = Price::create( $data );
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
