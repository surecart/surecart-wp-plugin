<?php
namespace SureCartBlocks\Controllers;

use SureCart\Models\Component;
use SureCart\Models\PaymentIntent;
use SureCart\Models\User;

/**
 * Payment method block controller class.
 */
class PaymentMethodController extends BaseController {
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

		return wp_kses_post(
			Component::tag( 'sc-payment-methods-list' )
			->id( 'sc-customer-payment-methods-list' )
			->with(
				[
					'query' => [
						'customer_ids' => array_values( User::current()->customerIds() ),
						'page'         => 1,
						'per_page'     => 100,
					],
				]
			)->render( $attributes['title'] ? "<span slot='heading'>" . $attributes['title'] . '</span>' : '' )
		);
	}

	/**
	 * Show a view to add a payment method.
	 *
	 * @return string
	 */
	public function create() {
		$output = '';

		if ( ! empty( User::current()->customerId( 'live' ) ) ) {
			$payment_intent_live = PaymentIntent::with( [ 'owner' ] )->create(
				[
					'processor_type' => 'stripe',
					'live_mode'      => true,
					'customer_id'    => User::current()->customerId( 'live' ),
				]
			);

			$output .= $this->renderCreate( $payment_intent_live );
		}

		if ( ! empty( User::current()->customerId( 'test' ) ) ) {
			$payment_intent_test = PaymentIntent::with( [ 'owner' ] )->create(
				[
					'processor_type' => 'stripe',
					'live_mode'      => false,
					'customer_id'    => User::current()->customerId( 'test' ),
				]
			);

			$output .= $this->renderCreate( $payment_intent_test );
		}

		return $output;

	}

	/**
	 * Render the create view.
	 *
	 * @param \SureCart\Models\PaymentIntent $payment_intent the payment intent.
	 * @return string
	 */
	public function renderCreate( $payment_intent ) {
		if ( empty( $payment_intent->processor_data->stripe->account_id ) ) {
			return '<sc-alert type="info" open>' . __( 'You cannot currently add a payment method. Please contact us for support.', 'surecart' ) . '</sc-alert>';
		}

		ob_start(); ?>

		<sc-spacing style="--spacing: var(--sc-spacing-large)">
			<sc-breadcrumbs>
				<sc-breadcrumb href="<?php echo esc_url( add_query_arg( [ 'tab' => $this->getTab() ], \SureCart::pages()->url( 'dashboard' ) ) ); ?>">
					<?php esc_html_e( 'Dashboard', 'surecart' ); ?>
				</sc-breadcrumb>
				<sc-breadcrumb>
					<?php esc_html_e( 'Add Payment Method', 'surecart' ); ?>
				</sc-breadcrumb>
			</sc-breadcrumbs>

			<sc-heading>
				<?php esc_html_e( 'Add Payment Method', 'surecart' ); ?>
			</sc-heading>

			<sc-payment-method-create
				client-secret="<?php echo esc_attr( $payment_intent->processor_data->stripe->client_secret ); ?>"
				success-url="<?php echo esc_url( add_query_arg( [ 'tab' => $this->getTab() ], \SureCart::pages()->url( 'dashboard' ) ) ); ?>"
				>
					<?php
						echo wp_kses_post(
							Component::tag( 'sc-stripe-element' )
							->id( 'customer-payment-method-add' )
							->with(
								[
									'stripeAccountId' => $payment_intent->processor_data->stripe->account_id,
									'publishableKey'  => $payment_intent->processor_data->stripe->publishable_key,
								]
							)->render()
						);
					?>
			</sc-payment-method-create>

			<div>
				<sc-text style="--color: var(--sc-color-gray-700); --font-size: var(--sc-font-size-small); --line-height: var(--sc-line-height-normal); --text-align: center;">
					<?php esc_html_e( 'By providing your card information, you allow Sure Cart to charge your card for future payments in accordance with their terms. You can review important information from Sure Cart on their Terms of Service and Privacy Policy pages.', 'surecart' ); ?>
				</sc-text>
			</div>
		</sc-spacing>
		<?php
		return ob_get_clean();
	}
}
