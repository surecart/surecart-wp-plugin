<?php
namespace CheckoutEngineBlocks\Controllers;

use CheckoutEngine\Models\Component;
use CheckoutEngine\Models\PaymentIntent;
use CheckoutEngine\Models\User;

/**
 * Payment method block controller class.
 */
class PaymentMethodController {
	/**
	 * List all payment methods.
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Block content.
	 *
	 * @return function
	 */
	public function index( $attributes, $content ) {
		if ( ! User::current()->isCustomer() ) {
			return;
		}
		\CheckoutEngine::assets()->addComponentData(
			'ce-payment-methods-list',
			'#ce-payment-methods-list',
			[
				'listTitle' => $attributes['title'] ?? __( 'Payment Methods', 'checkout-engine' ),
				'query'     => [
					'customer_ids' => array_values( User::current()->customerIds() ),
					'page'         => 1,
					'per_page'     => 100,
				],
			]
		);
		return '<ce-payment-methods-list id="ce-payment-methods-list"></ce-payment-methods-list>';
	}

	/**
	 * Show a view to add a payment method.
	 *
	 * @return function
	 */
	public function create() {
		$tab = isset( $_GET['tab'] ) ? sanitize_text_field( wp_unslash( $_GET['tab'] ) ) : false;

		$payment_intent = PaymentIntent::with( [ 'owner' ] )->create(
			[
				'processor_type' => 'stripe',
				'live_mode'      => true,
				'customer_id'    => User::current()->customerId(),
			]
		);

		if ( empty( $payment_intent->processor_data->stripe->account_id ) ) {
			return '<ce-alert type="info" open>' . __( 'You cannot currently add a payment method. Please contact us for support.', 'checkout-engine' ) . '</ce-alert>';
		}

		ob_start(); ?>

		<ce-spacing style="--spacing: var(--ce-spacing-large)">
			<ce-breadcrumbs>
				<ce-breadcrumb href="<?php echo esc_url( add_query_arg( [ 'tab' => $tab ], \CheckoutEngine::pages()->url( 'dashboard' ) ) ); ?>">
					<?php esc_html_e( 'Dashboard', 'checkout_engine' ); ?>
				</ce-breadcrumb>
				<ce-breadcrumb>
					<?php esc_html_e( 'Add Payment Method', 'checkout_engine' ); ?>
				</ce-breadcrumb>
			</ce-breadcrumbs>

			<ce-heading>
				<?php esc_html_e( 'Add Payment Method', 'checkout_engine' ); ?>
			</ce-heading>

			<ce-payment-method-create
				client-secret="<?php echo esc_attr( $payment_intent->processor_data->stripe->client_secret ); ?>"
				success-url="<?php echo esc_url( add_query_arg( [ 'tab' => $tab ], \CheckoutEngine::pages()->url( 'dashboard' ) ) ); ?>"
				>
					<?php
						echo wp_kses_post(
							Component::tag( 'ce-stripe-element' )
							->id( 'customer-payment-method-add' )
							->with(
								[
									'listTitle'       => __( 'Update Subscription', 'checkout-engine' ),
									'stripeAccountId' => $payment_intent->processor_data->stripe->account_id,
									'publishableKey'  => $payment_intent->processor_data->stripe->publishable_key,
								]
							)->render()
						);
					?>
			</ce-payment-method-create>

			<div>
				<ce-text style="--color: var(--ce-color-gray-700); --font-size: var(--ce-font-size-small); --line-height: var(--ce-line-height-normal); --text-align: center;">
					<?php esc_html_e( 'By providing your card information, you allow Sure Cart to charge your card for future payments in accordance with their terms. You can review important information from Sure Cart on their Terms of Service and Privacy Policy pages.', 'checkout-engine' ); ?>
				</ce-text>
			</div>
		</ce-spacing>
		<?php
		return ob_get_clean();
	}
}
