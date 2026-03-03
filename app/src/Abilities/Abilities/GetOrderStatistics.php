<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Statistic;

/**
 * Get order/sales statistics.
 */
class GetOrderStatistics extends AbstractAbility {

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/get-order-statistics';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Get Order Statistics', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Get SureCart sales and order statistics for a given date range.', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function check_permission(): bool {
		return current_user_can( 'view_sc_shop_reports' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_input_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'start_date' => array(
					'type'        => 'string',
					'description' => __( 'Start date in YYYY-MM-DD format.', 'surecart' ),
				),
				'end_date'   => array(
					'type'        => 'string',
					'description' => __( 'End date in YYYY-MM-DD format.', 'surecart' ),
				),
			),
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_output_schema(): array {
		return array(
			'type'       => 'object',
			'properties' => array(
				'success'    => array( 'type' => 'boolean' ),
				'statistics' => array( 'type' => 'object' ),
			),
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function execute( array $input ): array {
		$args = array();

		if ( ! empty( $input['start_date'] ) ) {
			$start_date = sanitize_text_field( $input['start_date'] );
			if ( ! $this->is_valid_date( $start_date ) ) {
				return $this->error( __( 'start_date must be in YYYY-MM-DD format.', 'surecart' ) );
			}
			$args['start_date'] = $start_date;
		}

		if ( ! empty( $input['end_date'] ) ) {
			$end_date = sanitize_text_field( $input['end_date'] );
			if ( ! $this->is_valid_date( $end_date ) ) {
				return $this->error( __( 'end_date must be in YYYY-MM-DD format.', 'surecart' ) );
			}
			$args['end_date'] = $end_date;
		}

		$stat       = new Statistic();
		$statistics = $stat->where( $args )->find( 'orders' );
		if ( is_wp_error( $statistics ) ) {
			return $this->error( $statistics->get_error_message() );
		}

		return $this->success(
			array(
				'statistics' => $this->model_to_array( $statistics ),
			)
		);
	}
}
