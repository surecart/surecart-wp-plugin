<?php

namespace SureCart\Models;

/**
 * Price model
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
	 * Get the listener url.
	 *
	 * @return string
	 */
	protected function getListenerUrl() {
		return get_home_url( null, '/surecart/webhooks', is_ssl() ? 'https' : 'http' );
	}

	/**
	 * Register webhook for this site
	 *
	 * @return $this|false
	 */
	protected function register() {
		$existing = $this->findExisting();

		if ( $existing ) {
			return $existing;
		}

		return $this->create(
			[
				'description' => 'Main webhook for SureCart',
				'enabled'     => true,
				'destination' => 'wordpress',
				'url'         => $this->getListenerUrl(),
				'webhook_events' => [
					// 'cancellation_act.updated',
					// 'customer.created',
					// 'customer.updated',
					// 'order.created',
					// 'order.made_processing',
					// 'order.paid', // In doc
					// 'order.payment_failed',
					'purchase.created',
					'purchase.invoked',
					'purchase.updated',
					'purchase.revoked',
					// 'refund.created',
					// 'refund.succeeded', // In doc
					// 'subscription.canceled', // In doc
					// 'subscription.created',
					// 'subscription.completed',
					// 'subscription.made_active', // In doc
					// 'subscription.made_past_due',
					// 'subscription.made_trialing', // In doc
					'subscription.renewed', // needed for AffiliateWP recurring referrals.
					// 'subscription.updated',
				],
			]
		);
	}

	/**
	 * Find existing webhook with the same listner url.
	 *
	 * @return \SureCart\Models\Webhook|false
	 */
	public function findExisting() {
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
}
