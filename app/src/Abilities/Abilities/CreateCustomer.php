<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Abilities\Concerns\MapsGenericAddress;
use SureCart\Models\Customer;

/**
 * Create a new customer.
 */
class CreateCustomer extends AbstractAbility {
	use MapsGenericAddress;

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/create-customer';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Create Customer', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Create a new SureCart customer with an email address, name, phone number, and optional billing/shipping addresses. Returns the newly created customer object.', 'surecart' );
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
		return 'An email address is required. IMPORTANT: Before creating, always check if the customer already exists using list-customers with the email as the query. Search BOTH live mode (default) and test mode (live_mode=false) to avoid creating duplicates. The SureCart API allows multiple customers with the same email, so failing to check will create duplicate records. Each call creates a new customer record — this cannot be undone easily.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'publish_sc_customers' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'email'                        => array(
					'type'        => 'string',
					'description' => __( 'Customer email address.', 'surecart' ),
				),
				'first_name'                   => array(
					'type'        => 'string',
					'description' => __( 'Customer first name.', 'surecart' ),
				),
				'last_name'                    => array(
					'type'        => 'string',
					'description' => __( 'Customer last name.', 'surecart' ),
				),
				'name'                         => array(
					'type'        => 'string',
					'description' => __( 'Customer full name or business name. Overrides first_name/last_name if set.', 'surecart' ),
				),
				'phone'                        => array(
					'type'        => 'string',
					'description' => __( 'Customer phone number.', 'surecart' ),
				),
				'live_mode'                    => array(
					'type'        => 'boolean',
					'description' => __( 'Whether this is a live mode customer. Set false for test mode.', 'surecart' ),
					'default'     => true,
				),
				'tax_enabled'                  => array(
					'type'        => 'boolean',
					'description' => __( 'Whether tax should be calculated for this customer.', 'surecart' ),
				),
				'shipping_address_city'        => array(
					'type'        => 'string',
					'description' => __( 'Shipping address city.', 'surecart' ),
				),
				'shipping_address_country'     => array(
					'type'        => 'string',
					'description' => __( 'Shipping address country (2-letter ISO code, e.g. US).', 'surecart' ),
				),
				'shipping_address_line_1'      => array(
					'type'        => 'string',
					'description' => __( 'Shipping address line 1.', 'surecart' ),
				),
				'shipping_address_line_2'      => array(
					'type'        => 'string',
					'description' => __( 'Shipping address line 2.', 'surecart' ),
				),
				'shipping_address_postal_code' => array(
					'type'        => 'string',
					'description' => __( 'Shipping address postal/zip code.', 'surecart' ),
				),
				'shipping_address_state'       => array(
					'type'        => 'string',
					'description' => __( 'Shipping address state/province code.', 'surecart' ),
				),
				'billing_matches_shipping'     => array(
					'type'        => 'boolean',
					'description' => __( 'If true, billing address will match shipping address.', 'surecart' ),
					'default'     => true,
				),
			),
			'required'   => array( 'email' ),
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
		$email = sanitize_email( $input['email'] );
		if ( empty( $email ) ) {
			return $this->error( 'invalid_email', __( 'The email address provided is not valid.', 'surecart' ) );
		}

		$data = array(
			'email' => $email,
		);

		// Simple string fields.
		$string_fields = array( 'name', 'first_name', 'last_name', 'phone' );
		foreach ( $string_fields as $field ) {
			if ( ! empty( $input[ $field ] ) ) {
				$data[ $field ] = sanitize_text_field( $input[ $field ] );
			}
		}

		// Boolean fields.
		if ( isset( $input['live_mode'] ) ) {
			$data['live_mode'] = (bool) $input['live_mode'];
		}

		if ( isset( $input['tax_enabled'] ) ) {
			$data['tax_enabled'] = (bool) $input['tax_enabled'];
		}

		if ( isset( $input['billing_matches_shipping'] ) ) {
			$data['billing_matches_shipping'] = (bool) $input['billing_matches_shipping'];
		}

		// Build shipping address from flat fields.
		$address = $this->map_generic_address( $input, 'shipping_address' );
		if ( ! empty( $address ) ) {
			$data['shipping_address'] = $address;
		}

		$customer = Customer::create( $data );
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
