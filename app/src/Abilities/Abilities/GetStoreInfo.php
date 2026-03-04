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
		return __( 'Get information about the connected SureCart store, including name, currency, and settings.', 'surecart' );
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
			'properties' => new \stdClass(),
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
