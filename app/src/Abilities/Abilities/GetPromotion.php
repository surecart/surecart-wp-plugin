<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Promotion;

/**
 * Get a single promotion by ID.
 */
class GetPromotion extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/get-promotion';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Get Promotion', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Get a single SureCart promotion by ID, including its associated coupon.', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'read_sc_promotions' );
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
					'description' => __( 'The promotion ID.', 'surecart' ),
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
				'success'   => array( 'type' => 'boolean' ),
				'promotion' => array( 'type' => 'object' ),
			),
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function execute( array $input ): array {
		$id = sanitize_text_field( $input['id'] ?? '' );
		if ( empty( $id ) ) {
			return $this->error( __( 'A promotion ID is required.', 'surecart' ) );
		}

		$promotion = Promotion::with( array( 'coupon' ) )->find( $id );
		if ( is_wp_error( $promotion ) ) {
			return $this->wp_error( $promotion );
		}

		return $this->success(
			array(
				'promotion' => $this->model_to_array( $promotion ),
			)
		);
	}
}
