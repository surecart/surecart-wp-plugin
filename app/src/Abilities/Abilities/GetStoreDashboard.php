<?php

namespace SureCart\Abilities\Abilities;

use SureCart\Models\Account;
use SureCart\Models\Statistic;

/**
 * Get a comprehensive store health summary.
 */
class GetStoreDashboard extends AbstractAbility {

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
		return __( 'Get a comprehensive store health summary: revenue, order count, active subscriptions, and abandoned checkouts. Best starting point for understanding store performance.', 'surecart' );
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
				'period' => array(
					'type'        => 'string',
					'description' => __( 'Time period for the dashboard data.', 'surecart' ),
					'enum'        => array( 'today', '7d', '30d', '90d' ),
					'default'     => '30d',
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
				'success'             => array( 'type' => 'boolean' ),
				'store'               => array( 'type' => 'object' ),
				'orders'              => array( 'type' => 'object' ),
				'subscriptions'       => array( 'type' => 'object' ),
				'abandoned_checkouts' => array( 'type' => 'object' ),
				'errors'              => array(
					'type'        => 'array',
					'items'       => array( 'type' => 'string' ),
					'description' => __( 'Errors encountered while fetching individual stat sections.', 'surecart' ),
				),
			),
			'required'   => array( 'success', 'store' ),
		);
	}

	/**
	 * {@inheritDoc}
	 */
	public function execute( array $input ): array {
		$period          = sanitize_text_field( $input['period'] ?? '30d' );
		$allowed_periods = array( 'today', '7d', '30d', '90d' );
		if ( ! in_array( $period, $allowed_periods, true ) ) {
			return $this->error(
				/* translators: %s: comma-separated list of valid period values */
				sprintf( __( 'Invalid period. Allowed values: %s', 'surecart' ), implode( ', ', $allowed_periods ) )
			);
		}

		$dates = $this->get_date_range( $period );

		// Get store info.
		$account = Account::find();
		if ( is_wp_error( $account ) ) {
			return $this->error( $account->get_error_message() );
		}

		$args = array(
			'start_at' => $dates['start_at'],
			'end_at'   => $dates['end_at'],
			'interval' => $dates['interval'],
		);

		$errors = array();

		// Get order statistics.
		$stat        = new Statistic();
		$order_stats = $stat->where( $args )->find( 'orders' );

		// Get subscription statistics.
		$stat               = new Statistic();
		$subscription_stats = $stat->where( $args )->find( 'subscriptions' );

		// Get abandoned checkout statistics.
		$stat                     = new Statistic();
		$abandoned_checkout_stats = $stat->where( $args )->find( 'abandoned_checkouts' );

		$result = array(
			'period' => $period,
			'store'  => $this->model_to_array( $account ),
		);

		if ( is_wp_error( $order_stats ) ) {
			$errors[] = $order_stats->get_error_message();
		} else {
			$result['orders'] = $this->model_to_array( $order_stats );
		}

		if ( is_wp_error( $subscription_stats ) ) {
			$errors[] = $subscription_stats->get_error_message();
		} else {
			$result['subscriptions'] = $this->model_to_array( $subscription_stats );
		}

		if ( is_wp_error( $abandoned_checkout_stats ) ) {
			$errors[] = $abandoned_checkout_stats->get_error_message();
		} else {
			$result['abandoned_checkouts'] = $this->model_to_array( $abandoned_checkout_stats );
		}

		if ( ! empty( $errors ) ) {
			$result['errors'] = $errors;
		}

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
