<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Account;
use SureCart\Models\Statistic;

/**
 * Get a comprehensive store health summary.
 */
class GetStoreDashboard extends AbstractAbility {

	/**
	 * Valid period identifiers for the dashboard.
	 *
	 * @var array<int, string>
	 */
	private const ALLOWED_PERIODS = array( 'today', '7d', '30d', '90d' );

	/**
	 * {@inheritDoc}
	 */
	public function get_name(): string {
		return 'surecart/get-store-dashboard';
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_label(): string {
		return __( 'Get Store Dashboard', 'surecart' );
	}

	/**
	 * {@inheritDoc}
	 */
	public function get_description(): string {
		return __( 'Retrieve a comprehensive SureCart store health summary including total revenue, order count, and recent activity for a given date range and interval. Useful for high-level reporting.', 'surecart' );
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
		return 'Use this for high-level store health checks. Supports date range filtering with start_date/end_date in YYYY-MM-DD format and intervals: hour, day, week, month, year. Defaults to the last 30 days with daily intervals if not specified. Set test_mode to true to view test transaction data (useful during store setup and QA).';
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
				'period'    => array(
					'type'        => 'string',
					'description' => __( 'Time period for the dashboard data.', 'surecart' ),
					'enum'        => self::ALLOWED_PERIODS,
					'default'     => '30d',
				),
				'test_mode' => array(
					'type'        => 'boolean',
					'description' => __( 'Set to true to view test mode data. Defaults to false (live mode).', 'surecart' ),
					'default'     => false,
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
				'success' => array( 'type' => 'boolean' ),
				'period'  => array( 'type' => 'string' ),
				'store'   => array( 'type' => 'object' ),
				'orders'  => array( 'type' => 'object' ),
			),
			'required'   => array( 'success', 'period', 'store', 'orders' ),
		);
	}

	/**
	 * {@inheritDoc}
	 *
	 * @param array $input The input data.
	 */
	public function execute( array $input ) {
		$period = sanitize_text_field( $input['period'] ?? '30d' );
		if ( ! in_array( $period, self::ALLOWED_PERIODS, true ) ) {
			return $this->error(
				'invalid_period',
				/* translators: %s: comma-separated list of valid period values */
				sprintf( __( 'Invalid period. Allowed values: %s', 'surecart' ), implode( ', ', self::ALLOWED_PERIODS ) )
			);
		}

		$dates = $this->get_date_range( $period );

		// Get store info.
		$account = Account::find();
		if ( is_wp_error( $account ) ) {
			return $account;
		}

		$test_mode = ! empty( $input['test_mode'] );

		$args = array(
			'start_at' => $dates['start_at'],
			'end_at'   => $dates['end_at'],
			'interval' => $dates['interval'],
		);

		if ( $test_mode ) {
			$args['live_mode'] = false;
		}

		$result = array(
			'period' => $period,
			'store'  => $this->model_to_array( $account ),
		);

		// Get order statistics.
		$order_stats = ( new Statistic() )->where( $args )->find( 'orders' );
		if ( is_wp_error( $order_stats ) ) {
			return $order_stats;
		}

		$result['orders'] = $this->model_to_array( $order_stats );

		return $this->success( $result );
	}

	/**
	 * Get the start date, end date, and grouping interval for a period.
	 *
	 * @param string $period The period identifier.
	 *
	 * @return array{start_at: string, end_at: string, interval: string}
	 */
	private function get_date_range( string $period ): array {
		$end_at = gmdate( 'Y-m-d' );

		switch ( $period ) {
			case 'today':
				$start_at = $end_at;
				$interval = 'hour';
				break;
			case '7d':
				$start_at = gmdate( 'Y-m-d', strtotime( '-7 days' ) );
				$interval = 'day';
				break;
			case '90d':
				$start_at = gmdate( 'Y-m-d', strtotime( '-90 days' ) );
				$interval = 'week';
				break;
			case '30d':
			default:
				$start_at = gmdate( 'Y-m-d', strtotime( '-30 days' ) );
				$interval = 'day';
				break;
		}

		return array(
			'start_at' => $start_at,
			'end_at'   => $end_at,
			'interval' => $interval,
		);
	}
}
