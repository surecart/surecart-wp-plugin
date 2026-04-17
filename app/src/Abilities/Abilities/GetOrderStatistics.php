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
		return __( 'Retrieve SureCart order and sales statistics for a given date range and interval. Returns time-series data points for revenue, order count, and average order value.', 'surecart' );
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
		return 'Use this for reporting and analytics dashboards. Supports date range filtering with start_date/end_date in YYYY-MM-DD format and intervals: hour, day, week, month, year.';
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
				'interval'   => array(
					'type'        => 'string',
					'description' => __( 'Grouping interval for the statistics data.', 'surecart' ),
					'enum'        => array( 'hour', 'day', 'week', 'month', 'year' ),
					'default'     => 'day',
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
	 *
	 * @param array $input The input data.
	 */
	public function execute( array $input ) {
		$args = $this->resolve_stats_args( $input );
		if ( is_wp_error( $args ) ) {
			return $args;
		}

		$stat       = new Statistic();
		$statistics = $stat->where( $args )->find( 'orders' );
		if ( is_wp_error( $statistics ) ) {
			return $statistics;
		}

		return $this->success(
			array(
				'statistics' => $this->model_to_array( $statistics ),
			)
		);
	}
}
