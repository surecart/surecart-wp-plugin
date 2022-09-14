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
		if ( ! is_user_logged_in() ) {
			return false;
		}

		return wp_kses_post(
			Component::tag( 'sc-payment-methods-list' )
			->id( 'sc-customer-payment-methods-list' )
			->with(
				[
					'isCustomer' => User::current()->isCustomer(),
					'query' => [
						'customer_ids' => array_values( User::current()->customerIds() ),
						'page'         => 1,
						'per_page'     => 100,
						'reusable'     => true,
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
		if ( empty( User::current()->customerId( $this->isLiveMode() ? 'live' : 'test' ) ) ) {
			ob_start(); ?>
				<sc-alert type="info" open>
					<?php if ( $this->isLiveMode() && ! empty( User::current()->customerId( 'test' ) ) ) { ?>
						<?php esc_html_e( 'You are not a live mode customer.', 'surecart' ); ?>
						<div style="margin-top:0.5em;">
							<sc-button href="<?php echo esc_url( add_query_arg( [ 'live_mode' => 'false' ] ) ); ?>" type="info" size="small">
								<?php esc_html_e( 'Switch to test mode.', 'surecart' ); ?>
							</sc-button>
						</div>
					<?php } elseif ( ! $this->isLiveMode() && ! empty( User::current()->customerId( 'live' ) ) ) { ?>
						<?php esc_html_e( 'You are not a test mode customer.', 'surecart' ); ?>
						<div style="margin-top:0.5em;">
							<sc-button href="<?php echo esc_url( add_query_arg( [ 'live_mode' => false ] ) ); ?>" type="info" size="small">
								<?php esc_html_e( 'Switch to live mode.', 'surecart' ); ?>
							</sc-button>
						</div>
					<?php } else { ?>
						<?php esc_html_e( 'You are not currently a customer.', 'surecart' ); ?>
					<?php } ?>
				</sc-alert>
			<?php
			return ob_get_clean();
		}

		$applicable_processors = array_filter(
			\SureCart::account()->processors ?? [],
			function( $processor ) {
				return $processor->live_mode === $this->isLiveMode() && $processor->recurring_enabled;
			}
		);

		$processor_names = array_filter(
			array_values(
				array_map(
					function( $processor ) {
						return $processor->processor_type;
					},
					$applicable_processors ?? []
				)
			)
		);

		if ( empty( $processor_names ) ) {
			return '<sc-alert type="info" open>' . __( 'You cannot currently add a payment method. Please contact us for support.', 'surecart' ) . '</sc-alert>';
		}

		ob_start();
		?>

		<sc-spacing style="--spacing: var(--sc-spacing-large)">
			<sc-breadcrumbs>
				<sc-breadcrumb href="<?php echo esc_url( add_query_arg( [ 'tab' => $this->getTab() ], remove_query_arg( array_keys( $_GET ) ) ) );  // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>">
				<?php esc_html_e( 'Dashboard', 'surecart' ); ?>
				</sc-breadcrumb>
				<sc-breadcrumb>
				<?php esc_html_e( 'Add Payment Method', 'surecart' ); ?>
				</sc-breadcrumb>
			</sc-breadcrumbs>

			<sc-heading>
			<?php esc_html_e( 'Add Payment Method', 'surecart' ); ?>
			<?php echo ! $this->isLiveMode() ? '<sc-tag type="warning" slot="end">' . esc_html__( 'Test Mode', 'surecart' ) . '</sc-tag>' : ''; ?>
			</sc-heading>

			<sc-toggles collapsible="false" theme="container" accordion>
			<?php if ( in_array( 'stripe', $processor_names ) ) : ?>
					<sc-toggle class="sc-stripe-toggle" show-control shady borderless>
						<span slot="summary" class="sc-payment-toggle-summary">
							<sc-flex>
								<sc-icon name="credit-card" style="font-size:24px"></sc-icon>
								<span><?php esc_html_e( 'Credit Card', 'surecart' ); ?></span>
							</sc-flex>
						</span>
						<sc-stripe-add-method
							success-url="<?php echo esc_url( home_url( add_query_arg( [ 'tab' => $this->getTab() ], remove_query_arg( array_keys( $_GET ) ) ) ) );  // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>"
							live-mode="<?php echo esc_attr( $this->isLiveMode() ? 'true' : 'false' ); ?>"
							customer-id="<?php echo esc_attr( User::current()->customerId( $this->isLiveMode() ? 'live' : 'test' ) ); ?>">
						</sc-stripe-add-method>
					</sc-toggle>
				<?php endif; ?>

			<?php if ( in_array( 'paypal', $processor_names ) ) : ?>
					<sc-toggle class="sc-paypal-toggle" show-control shady borderless>
						<span slot="summary" class="sc-payment-toggle-summary">
							<sc-icon name="paypal" style="width: 80px; font-size: 24px"></sc-icon>
						</span>
						<sc-paypal-add-method
							success-url="<?php echo esc_url( home_url( add_query_arg( [ 'tab' => $this->getTab() ], remove_query_arg( array_keys( $_GET ) ) ) ) );  // phpcs:ignore WordPress.Security.NonceVerification.Recommended ?>"
							live-mode="<?php echo esc_attr( $this->isLiveMode() ? 'true' : 'false' ); ?>"
							currency="<?php echo esc_attr( \SureCart::account()->currency ); ?>"
							customer-id="<?php echo esc_attr( User::current()->customerId( $this->isLiveMode() ? 'live' : 'test' ) ); ?>">
						</sc-paypal-add-method>
					</sc-toggle>
				<?php endif; ?>
			</sc-toggles>
		</sc-spacing>
		<?php
		return ob_get_clean();
	}
}
