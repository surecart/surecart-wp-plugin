<?php
namespace CheckoutEngineBlocks\Controllers;

use CheckoutEngine\Models\Component;
use CheckoutEngine\Models\Customer;
use CheckoutEngine\Models\PaymentIntent;
use CheckoutEngine\Models\User;

/**
 * Payment method block controller class.
 */
class CustomerController extends BaseController {
	/**
	 * List all payment methods.
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Block content.
	 *
	 * @return function
	 */
	public function show( $attributes, $content ) {
		if ( ! User::current()->isCustomer() ) {
			return;
		}
		return '<ce-customer-details customer-id="' . User::current()->customerId() . '"></ce-customer-details>';
	}

	/**
	 * Show a view to add a payment method.
	 *
	 * @return function
	 */
	public function edit() {
		$customer = Customer::with( [ 'billing_address', 'shipping_address' ] )->find( User::current()->customerId() );
		$back     = add_query_arg( [ 'tab' => $this->getTab() ], \CheckoutEngine::pages()->url( 'dashboard' ) );
		ob_start(); ?>

		<ce-spacing style="--spacing: var(--ce-spacing-large)">
			<ce-breadcrumbs>
				<ce-breadcrumb href="<?php echo esc_url( $back ); ?>">
					<?php esc_html_e( 'Dashboard', 'checkout_engine' ); ?>
				</ce-breadcrumb>
				<ce-breadcrumb>
					<?php esc_html_e( 'Billing Details', 'checkout_engine' ); ?>
				</ce-breadcrumb>
			</ce-breadcrumbs>

			<?php
			echo wp_kses_post(
				Component::tag( 'ce-customer-edit' )
				->id( 'customer-customer-edit' )
				->with(
					[
						'header'     => __( 'Update Billing Details', 'checkout-engine' ),
						'customer'   => $customer,
						'successUrl' => esc_url( $back ),
					]
				)->render()
			);
			?>
		</ce-spacing>

			<?php
			return ob_get_clean();
	}
}
