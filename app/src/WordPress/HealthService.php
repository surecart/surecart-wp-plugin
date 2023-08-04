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
				'api'                 => array(
					'label'   => __( 'API Connectivity', 'surecart' ),
					'value'   => (bool) ApiToken::get() ? __( 'Connected', 'surecart' ) : __( 'Not connected', 'surecart' ),
					'private' => false,
				),
				'store_id'            => array(
					'label'   => __( 'Store ID', 'surecart' ),
					'value'   => \SureCart::account()->id,
					'private' => false,
				),
				'url'                 => array(
					'label'   => __( 'Store URL', 'surecart' ),
					'value'   => \SureCart::account()->url,
					'private' => false,
				),
				'webhooks_processing' => array(
					'label'   => __( 'Webhooks Processing', 'surecart' ),
					'value'   => ! empty( \SureCart::webhooks()->getFailedWebhookProcesses() ) ? __( 'Error', 'surecart' ) : __( 'Working', 'surecart' ),
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
			$tests['direct']['surecart_webhook_test'] = array(
				'label' => __( 'SureCart', 'neve' ) . ' ' . __( 'Webhooks Processing', 'surecart' ),
				'test'  => [ $this, 'webhooksProcessingTest' ],
			);
			$tests['async']['surecart_webhooks_test'] = array(
				'label'             => __( 'SureCart', 'surecart' ) . ' ' . __( 'Webhooks Connection', 'surecart' ),
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
	 * Check that webhooks are processing normally.
	 *
	 * @return array
	 */
	public function webhooksProcessingTest() {
		$failed_processes = \SureCart::webhooks()->getFailedWebhookProcesses();
		$has_errors       = count( $failed_processes ) > 0;

		return array(
			'label'       => $has_errors ? __( 'SureCart Webhooks Processing Error', 'surecart' ) : __( 'SureCart Webhooks Processing', 'surecart' ),
			'status'      => $has_errors ? 'critical' : 'good',
			'badge'       => array(
				'label' => __( 'SureCart', 'surecart' ),
				'color' => $has_errors ? 'red' : 'blue',
			),
			'description' => sprintf(
				'<p>%s</p>',
				$has_errors ? __( 'Some of your webhooks failed to process on your site. Please check your error logs to make sure errors did not occur in webhook processing', 'surecart' ) : __( 'Webhook processing is working normally.', 'surecart' )
			),
			'test'        => 'surecart_webhooks_processing_test',
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

		// Defaults.
		$description = __( 'Webhooks are working normally.', 'surecart' );
		$label       = __( 'SureCart', 'surecart' ) . ' ' . __( 'Webhooks', 'surecart' );
		$status      = 'good';

		if ( empty( $webhook->enabled ) ) {
			$status      = 'critical';
			$label       = __( 'SureCart', 'surecart' ) . ' ' . __( 'webhook is disabled.', 'surecart' );
			$description = __( 'The SureCart webhook is currently disabled which can cause issues with integrations. This can happen automatically due to repeated errors, or could have been disabled manually. Please re-enable the webhook and troubleshoot the issue if integrations are important to your store.', 'surecart' );
		} elseif ( ! empty( $webhook->erroring_grace_period_ends_at ) ) {
			$status      = 'critical';
			$label       = __( 'SureCart', 'surecart' ) . ' ' . __( 'webhook connection is being monitored for errors.', 'surecart' );
			$description = __( 'The SureCart webhook has received repeated errors. This will eventually lead to the webhook being deactivated. Please troubleshoot the issue if integrations are important to your store.', 'surecart' );
		}

		return array(
			'label'       => $label,
			'status'      => $status,
			'badge'       => array(
				'label' => __( 'SureCart', 'surecart' ),
				'color' => 'critical' === $status ? 'red' : 'blue',
			),
			'description' => sprintf(
				'<p>%s</p>',
				$description
			),
			'actions'     => 'critical' === $status ? sprintf(
				'<a href="%s" class="button" target="_blank">%s</a>',
				esc_url( untrailingslashit( SURECART_APP_URL ) . '/developer' ),
				__( 'Troubleshoot Connection', 'surecart' )
			) : '',
			'test'        => 'surecart_webhooks_test',
		);
	}
}
