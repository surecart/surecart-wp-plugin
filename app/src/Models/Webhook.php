<?php

namespace SureCart\Models;

/**
 * Webhook Model.
 */
class Webhook extends Model {
	/**
	 * Rest API endpoint
	 *
	 * @var string
	 */
	protected $endpoint = 'webhook_endpoints';

	/**
	 * Object name
	 *
	 * @var string
	 */
	protected $object_name = 'webhook_endpoint';

	/**
	 * Group name.
	 *
	 * @var string
	 */
	public const GROUP_NAME = 'surecart-webhooks';

	/**
	 * Is this cachable?
	 *
	 * @var boolean
	 */
	protected $cachable = true;

	/**
	 * Clear cache when webhook endpoints are updated.
	 *
	 * @var string
	 */
	protected $cache_key = 'webhook_endpoints_updated_at';

	/**
	 * Get the listener url.
	 *
	 * @return string
	 */
	protected function getListenerUrl(): string {
		return get_home_url( null, '/surecart/webhooks', is_ssl() ? 'https' : 'http' );
	}

	/**
	 * Register webhook for this site.
	 *
	 * @return self|boolean
	 */
	protected function register() {
		$existing = $this->findExisting();

		if ( $existing ) {
			return $existing;
		}

		$webhook = $this->create(
			[
				'description'    => 'Main webhook for SureCart',
				'enabled'        => true,
				'destination'    => 'wordpress',
				'url'            => $this->getListenerUrl(),
				'webhook_events' => \SureCart::config()->webhook_events,
			]
		);

		if ( ! $webhook || empty( $webhook->id ) ) {
			return false;
		}

		// Send a test webhook to check if it works.
		$this->sendTestWebhook( $webhook );

		return $webhook;
	}

	/**
	 * Find existing webhook with the same listener url.
	 *
	 * @return \SureCart\Models\Webhook|boolean
	 */
	protected function findExisting() {
		$webhooks = $this->setPagination( [ 'per_page' => 100 ] )->get();
		if ( is_array( $webhooks ) && ! empty( $webhooks ) ) {
			foreach ( $webhooks as $webhook ) {
				if ( $webhook['url'] === $this->getListenerUrl() ) {
					return $webhook;
				}
			}
		}
		return false;
	}

	/**
	 * Has any webhook error or not.
	 *
	 * We'll hit this cached endpoint on every page load and see if there is any webhook error.
	 *
	 * @return boolean
	 */
	protected function hasAnyWebhookError(): bool {
		$registered_webhook = \SureCart::webhooks()->getRegisteredWebhook();

		if ( ! $registered_webhook || empty( $registered_webhook['id'] ) ) {
			return true;
		}

		$webhook = $this->find( $registered_webhook['id'] );

		if ( ! $webhook || empty( $webhook->id ) ) {
			return true;
		}

		// If erroring_grace_period_started_at and erroring_grace_period_ends_at is not empty, then there is an error.
		if ( ! empty( $webhook->erroring_grace_period_started_at ) || ! empty( $webhook->erroring_grace_period_ends_at ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Delete same url webhooks.
	 *
	 * @param string $excluded_id Excluded webhook id.
	 *
	 * @return void
	 */
	protected function removeSameUrlWebhooks( $excluded_id ): void {
		$webhooks = $this->setPagination( [ 'per_page' => 100 ] )->get();
		if ( is_array( $webhooks ) && ! empty( $webhooks ) ) {
			foreach ( $webhooks as $webhook_object ) {
				if ( $webhook_object->id !== $excluded_id && $this->getListenerUrl() === $webhook_object['url'] ) {
					$this->delete( $webhook_object->id );
				}
			}
		}
	}

	/**
	 * Send test webhook.
	 *
	 * @param Webhook $webhook Webhook object.
	 *
	 * @return void
	 */
	private function sendTestWebhook( Webhook $webhook ) {
		try {
			$this->makeRequest(
				[
					'method' => 'POST',
					'query'  => [],
				],
				$this->endpoint . '/' . $webhook->id . '/test',
			);
		} catch ( \Exception $exception ) {
			add_action(
				'admin_notices',
				function() {
					\SureCart::webhooks()->showWebhooksErrorNotice( new \WP_Error( 'webhook-test-error', esc_html__( 'The webhook is not working. Please check your site connection.', 'surecart' ) ) );
				}
			);
		}
	}
}
