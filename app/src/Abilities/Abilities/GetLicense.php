<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\License;

/**
 * Get a single license.
 */
class GetLicense extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/get-license';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Get License', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Get details of a specific SureCart license by its ID or key, including activations and purchase info.', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'read_sc_licenses' );
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
					'description' => __( 'The license ID or key.', 'surecart' ),
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
				'license' => array( 'type' => 'object' ),
			),
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function execute( array $input ): array {
		$license = License::with( array( 'activations', 'purchase' ) )->find( sanitize_text_field( $input['id'] ) );
		if ( is_wp_error( $license ) ) {
			return $this->wp_error( $license );
		}

		return $this->success(
			array(
				'license' => $this->model_to_array( $license ),
			)
		);
	}
}
