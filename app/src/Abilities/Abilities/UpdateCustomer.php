<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Abilities\Concerns\MapsGenericAddress;
use SureCart\Models\Customer;

/**
 * Update an existing customer.
 */
class UpdateCustomer extends AbstractAbility {
	use MapsGenericAddress;

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/update-customer';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Update Customer', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Update an existing SureCart customer by their ID. Supports changing email, name, phone number, and billing/shipping addresses. Only provided fields are updated.', 'surecart' );
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
		return 'Requires a valid customer ID. Only include the fields you want to change — omitted fields are not modified. Email changes may affect login credentials if the customer has a linked WordPress user.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'edit_sc_customers' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'id'                       => array(
					'type'        => 'string',
					'description' => __( 'The customer ID to update.', 'surecart' ),
				),
				'email'                    => array(
					'type'        => 'string',
					'description' => __( 'Customer email address.', 'surecart' ),
				),
				'first_name'               => array(
					'type'        => 'string',
					'description' => __( 'Customer first name.', 'surecart' ),
				),
				'last_name'                => array(
					'type'        => 'string',
					'description' => __( 'Customer last name.', 'surecart' ),
				),
				'name'                     => array(
					'type'        => 'string',
					'description' => __( 'Customer full name or business name. Overrides first_name/last_name if set.', 'surecart' ),
				),
				'phone'                    => array(
					'type'        => 'string',
					'description' => __( 'Customer phone number.', 'surecart' ),
				),
				'tax_enabled'              => array(
					'type'        => 'boolean',
					'description' => __( 'Whether tax should be calculated for this customer.', 'surecart' ),
				),
				'unsubscribed'             => array(
					'type'        => 'boolean',
					'description' => __( 'Whether the customer has unsubscribed from opt-in emails.', 'surecart' ),
				),
				'shipping_address_city'    => array(
					'type'        => 'string',
					'description' => __( 'Shipping address city.', 'surecart' ),
				),
				'shipping_address_country' => array(
					'type'        => 'string',
					'description' => __( 'Shipping address country (2-letter ISO code, e.g. US).', 'surecart' ),
				),
				'shipping_address_line_1'  => array(
					'type'        => 'string',
					'description' => __( 'Shipping address line 1.', 'surecart' ),
				),
				'shipping_address_line_2'  => array(
					'type'        => 'string',
					'description' => __( 'Shipping address line 2.', 'surecart' ),
				),
				'shipping_address_postal_code' => array(
					'type'        => 'string',
					'description' => __( 'Shipping address postal/zip code.', 'surecart' ),
				),
				'shipping_address_state'   => array(
					'type'        => 'string',
					'description' => __( 'Shipping address state/province code.', 'surecart' ),
				),
				'billing_matches_shipping' => array(
					'type'        => 'boolean',
					'description' => __( 'If true, billing address will match shipping address.', 'surecart' ),
				),
				'billing_address_city'     => array(
					'type'        => 'string',
					'description' => __( 'Billing address city. Only used when billing_matches_shipping is false.', 'surecart' ),
				),
				'billing_address_country'  => array(
					'type'        => 'string',
					'description' => __( 'Billing address country (2-letter ISO code).', 'surecart' ),
				),
				'billing_address_line_1'   => array(
					'type'        => 'string',
					'description' => __( 'Billing address line 1.', 'surecart' ),
				),
				'billing_address_line_2'   => array(
					'type'        => 'string',
					'description' => __( 'Billing address line 2.', 'surecart' ),
				),
				'billing_address_postal_code' => array(
					'type'        => 'string',
					'description' => __( 'Billing address postal/zip code.', 'surecart' ),
				),
				'billing_address_state'    => array(
					'type'        => 'string',
					'description' => __( 'Billing address state/province code.', 'surecart' ),
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
	public function execute( array $input ) {
		$id = sanitize_text_field( $input['id'] ?? '' );
		if ( empty( $id ) ) {
			return $this->error( 'missing_id', __( 'A customer ID is required.', 'surecart' ) );
		}

		$data = array( 'id' => $id );

		// Simple string fields.
		$string_fields = array( 'email', 'name', 'first_name', 'last_name', 'phone' );
		foreach ( $string_fields as $field ) {
			if ( isset( $input[ $field ] ) && '' !== $input[ $field ] ) {
				$data[ $field ] = 'email' === $field
					? sanitize_email( $input[ $field ] )
					: sanitize_text_field( $input[ $field ] );
			}
		}

		// Boolean fields.
		$bool_fields = array( 'tax_enabled', 'unsubscribed', 'billing_matches_shipping' );
		foreach ( $bool_fields as $field ) {
			if ( isset( $input[ $field ] ) ) {
				$data[ $field ] = (bool) $input[ $field ];
			}
		}

		// Build addresses from flat fields.
		$shipping = $this->map_generic_address( $input, 'shipping_address' );
		if ( ! empty( $shipping ) ) {
			$data['shipping_address'] = $shipping;
		}

		$billing = $this->map_generic_address( $input, 'billing_address' );
		if ( ! empty( $billing ) ) {
			$data['billing_address'] = $billing;
		}

		$customer = Customer::update( $data );
		if ( is_wp_error( $customer ) ) {
			return $customer;
		}

		return $this->success(
			array(
				'customer' => $this->model_to_array( $customer ),
			)
		);
	}
}
