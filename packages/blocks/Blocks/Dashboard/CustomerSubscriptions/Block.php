<?php

namespace CheckoutEngineBlocks\Blocks\Dashboard\CustomerSubscriptions;

use CheckoutEngine\Models\Subscription;
use CheckoutEngine\Models\User;
use CheckoutEngineBlocks\Blocks\Dashboard\DashboardPage;

/**
 * Checkout block
 */
class Block extends DashboardPage {
	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return function
	 */
	public function render( $attributes, $content ) {
		if ( ! User::current()->isCustomer() ) {
			return;
		}

		\CheckoutEngine::assets()->addComponentData(
			'ce-subscriptions-list',
			'#customer-subscriptions-index',
			[
				'listTitle' => $attributes['title'] ?? __( 'Subscriptions', 'checkout-engine' ),
				'query'     => [
					'customer_ids' => array_values( User::current()->customerIds() ),
					'status'       => [ 'active', 'trialing' ],
					'page'         => 1,
					'per_page'     => 10,
				],
			]
		);
		return '<ce-subscriptions-list id="customer-subscriptions-index"></ce-subscriptions-list>';
	}

	/**
	 * Show and individual checkout session.
	 *
	 * @param string $id Session ID.
	 *
	 * @return function
	 */
	public function show( $id ) {
		return \CheckoutEngine::blocks()->render(
			'web/dashboard/subscriptions/show',
			[
				'id' => $id,
			]
		);
	}

	/**
	 * Show and individual checkout session.
	 *
	 * @return function
	 */
	public function edit() {
		$id           = isset( $_GET['id'] ) ? sanitize_text_field( wp_unslash( $_GET['id'] ) ) : false;
		$tab          = isset( $_GET['tab'] ) ? sanitize_text_field( wp_unslash( $_GET['tab'] ) ) : false;
		$subscription = Subscription::with( [ 'price', 'price.product', 'latest_invoice', 'product.product_group' ] )->find( $id );

		\CheckoutEngine::assets()->addComponentData(
			'ce-subscription',
			'#customer-subscription',
			[
				'listTitle'    => $attributes['title'] ?? __( 'Update Subscription', 'checkout-engine' ),
				'subscription' => $subscription,
			]
		);
		\CheckoutEngine::assets()->addComponentData(
			'ce-subscription-switch',
			'#customer-subscription-switch',
			[
				'listTitle'     => $attributes['title'] ?? __( 'Update Subscription', 'checkout-engine' ),
				'product-group' => $subscription->price->product->product_group ?? null,
				'subscription'  => $subscription,
			]
		);
		ob_start(); ?>
		<ce-spacing style="--spacing: var(--ce-spacing-large)">
			<ce-breadcrumbs>
				<ce-breadcrumb href="<?php echo esc_url( add_query_arg( [ 'tab' => $tab ], \CheckoutEngine::pages()->url( 'dashboard' ) ) ); ?>">
					<?php esc_html_e( 'Dashboard', 'checkout_engine' ); ?>
				</ce-breadcrumb>
				<ce-breadcrumb>
					<?php esc_html_e( 'Subscription', 'checkout_engine' ); ?>
				</ce-breadcrumb>
			</ce-breadcrumbs>

			<ce-subscription id="customer-subscription"></ce-subscription>
			<ce-subscription-switch id="customer-subscription-switch"></ce-subscription-switch>
		</ce-spacing>

		<?php
		return ob_get_clean();
	}

	/**
	 * Show and individual checkout session.
	 *
	 * @param array $attributes Block attributes.
	 *
	 * @return function
	 */
	public function index( $attributes ) {
		if ( ! User::current()->isCustomer() ) {
			return;
		}
		\CheckoutEngine::assets()->addComponentData(
			'ce-subscriptions-list',
			'#customer-subscriptions-index',
			[
				'listTitle' => $attributes['title'] ?? __( 'Subscriptions', 'checkout-engine' ),
				'query'     => [
					'customer_ids' => array_values( User::current()->customerIds() ),
					'status'       => [ 'active', 'trialing' ],
					'page'         => 1,
					'per_page'     => 10,
				],
			]
		);
		return '<ce-subscriptions-list id="customer-subscriptions-index"></ce-subscriptions-list>';
	}
}
