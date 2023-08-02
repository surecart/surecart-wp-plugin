<?php

namespace SureCart\WordPress;

use SureCart\Models\Account;
use SureCart\Models\ApiToken;
use SureCart\Models\RegisteredWebhook;
use SureCart\Support\Server;

class HealthService {
	/**
	 * Bootstrap the service.
	 *
	 * @return void
	 */
	public function bootstrap() {
		add_filter( 'debug_information', [ $this, 'debugInfo' ] );
		add_filter( 'site_status_tests', [ $this, 'tests' ] );
	}

	/**
	 * Add debug information.
	 *
	 * @param array $debug_info Debug List.
	 *
	 * @return array
	 */
	public function debugInfo( $debug_info ) {
		$debug_info['surecart'] = array(
			'label'  => __( 'SureCart', 'surecart' ),
			'fields' => array(
				'api'      => array(
					'label'   => __( 'API Connectivity', 'surecart' ),
					'value'   => (bool) ApiToken::get() ? __( 'Connected', 'surecart' ) : __( 'Not connected', 'surecart' ),
					'private' => false,
				),
				'store_id' => array(
					'label'   => __( 'Store ID', 'surecart' ),
					'value'   => \SureCart::account()->id,
					'private' => false,
				),
				'url'      => array(
					'label'   => __( 'Store URL', 'surecart' ),
					'value'   => \SureCart::account()->url,
					'private' => false,
				),
			),
		);
		return $debug_info;
	}

	/**
	 * Register tests for the Status Page
	 *
	 * @param array $tests List of tests.
	 *
	 * @return array
	 */
	public function tests( $tests ) {
		$tests['async']['surecart_api_test'] = array(
			'label'             => __( 'SureCart', 'surecart' ) . ' ' . __( 'API connectivity', 'surecart' ),
			'test'              => rest_url( 'surecart/v1/site-health/api-connectivity' ),
			'has_rest'          => true,
			'async_direct_test' => [ $this, 'apiTest' ],
		);

		$is_localhost = ( new Server( get_home_url() ) )->isLocalHost();
		// if ( ! $is_localhost ) {
			$tests['async']['surecart_webhooks_test'] = array(
				'label'             => __( 'SureCart', 'surecart' ) . ' ' . __( 'Webhooks', 'surecart' ),
				'test'              => rest_url( 'surecart/v1/site-health/webhooks' ),
				'has_rest'          => true,
				'async_direct_test' => [ $this, 'webhooksTest' ],
			);
			// }

			return $tests;
	}

	/**
	 * Neve API test pretty response
	 *
	 * @return array
	 */
	public function apiTest() {
		$account = Account::find();

		return array(
			'label'       => __( 'SureCart', 'surecart' ) . ' ' . __( 'API connectivity', 'surecart' ),
			'status'      => $account->id ? 'good' : 'critical',
			'badge'       => array(
				'label' => __( 'SureCart', 'surecart' ),
				'color' => $account->id ? 'blue' : 'red',
			),
			'description' => sprintf(
				'<p>%s</p>',
				$account->id ? __( 'API for is reachable.', 'surecart' ) : __( 'API for is not reachable.', 'surecart' )
			),
			'actions'     => '',
			'test'        => 'surecart_api_test',
		);
	}

	/**
	 * Neve API test pretty response
	 *
	 * @return array
	 */
	public function webhooksTest() {
		// clear account cache.
		\SureCart::account()->clearCache();

		$webhook = RegisteredWebhook::get();

		$description = __( 'Webhooks are working normally.', 'surecart' );
		$label       = __( 'SureCart', 'surecart' ) . ' ' . __( 'Webhooks', 'surecart' );
		if ( ! empty( $webhook->erroring_grace_period_ends_at ) ) {
			$label = __( 'SureCart', 'surecart' ) . ' ' . __( 'Webhooks', 'surecart' ) . ' ' . __( 'Error', 'surecart' );
			if ( $webhook->erroring_grace_period_ends_at > time() ) {
				$label       = __( 'SureCart', 'surecart' ) . ' ' . __( 'Webhooks are being monitored for errors.', 'surecart' );
				$description = __( 'Webhooks are being monitored for errors.', 'surecart' );
			} else {
				$label       = __( 'SureCart', 'surecart' ) . ' ' . __( 'Webhooks have been disabled due to repeated errors.', 'surecart' );
				$description = __( 'Webhooks are have been disabled due to repeated errors.', 'surecart' );
			}
		}

		return array(
			'label'       => $label,
			'status'      => ! empty( $webhook->erroring_grace_period_ends_at ) ? 'critical' : 'good',
			'badge'       => array(
				'label' => __( 'SureCart', 'surecart' ),
				'color' => ! empty( $webhook->erroring_grace_period_ends_at ) ? 'red' : 'blue',
			),
			'description' => sprintf(
				'<p>%s</p>',
				$description
			),
			'actions'     => sprintf(
				'<a href="%s" class="button" target="_blank">%s</a>',
				esc_url( untrailingslashit( SURECART_APP_URL ) . '/developer' ),
				__( 'Troubleshoot Connection', 'surecart' )
			),
			'test'        => 'surecart_webhooks_test',
		);
	}

}
