<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Account;

/**
 * Get store/account information.
 */
class GetStoreInfo extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/get-store-info';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Get Store Info', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Retrieve the current SureCart store (account) information including store name, currency, URL, branding settings, and entitlements. Returns a single account object.', 'surecart' );
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
		return 'Use this to check store configuration, currency, or account status. This is often the first call to make when orienting to a store.';
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'manage_sc_shop_settings' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(),
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
				'store'   => array(
					'type'       => 'object',
					'properties' => array(
						'id'       => array( 'type' => 'string' ),
						'name'     => array( 'type' => 'string' ),
						'currency' => array( 'type' => 'string' ),
						'url'      => array( 'type' => 'string' ),
					),
				),
			),
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function execute( array $input ) {
		$account = Account::find();
		if ( is_wp_error( $account ) ) {
			return $account;
		}

		return $this->success(
			array(
				'store' => $this->model_to_array( $account ),
			)
		);
	}
}
