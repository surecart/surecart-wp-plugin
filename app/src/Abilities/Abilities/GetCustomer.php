<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Customer;

/**
 * Get a single customer with purchases.
 */
class GetCustomer extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/get-customer';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Get Customer', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Get a single SureCart customer by ID, including their purchases.', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'read_sc_customers' );
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
					'description' => __( 'The customer ID.', 'surecart' ),
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
				'success'  => array( 'type' => 'boolean' ),
				'customer' => array( 'type' => 'object' ),
			),
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function execute( array $input ): array {
		$customer = Customer::with( array( 'purchases' ) )->find( sanitize_text_field( $input['id'] ) );
		if ( is_wp_error( $customer ) ) {
			return $this->error( $customer->get_error_message() );
		}

		return $this->success(
			array(
				'customer' => $this->model_to_array( $customer ),
			)
		);
	}
}
