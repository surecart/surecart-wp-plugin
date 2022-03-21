<?php
namespace CheckoutEngineBlocks\Controllers;

use CheckoutEngine\Models\Component;
use CheckoutEngine\Models\Customer;
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

		$output = '';

		// show test.
		if ( ! empty( User::current()->customerId( 'test' ) ) ) {
			$output .= '<ce-dashboard-customer-details customer-id="' . User::current()->customerId( 'test' ) . '"></ce-dashboard-customer-details>';
		}
		// show live.
		if ( ! empty( User::current()->customerId( 'live' ) ) ) {
			$output .= '<ce-dashboard-customer-details customer-id="' . User::current()->customerId( 'live' ) . '"></ce-dashboard-customer-details>';
		}

		return $output;
	}

	/**
	 * Show a view to add a payment method.
	 *
	 * @return function
	 */
	public function edit() {
		$back = add_query_arg( [ 'tab' => $this->getTab() ], \CheckoutEngine::pages()->url( 'dashboard' ) );
		ob_start(); ?>

		<ce-spacing style="--spacing: var(--ce-spacing-large)">
			<ce-breadcrumbs>
				<ce-breadcrumb href="<?php echo esc_url( $back ); ?>">
					<?php esc_html_e( 'Dashboard', 'surecart' ); ?>
				</ce-breadcrumb>
				<ce-breadcrumb>
					<?php esc_html_e( 'Billing Details', 'surecart' ); ?>
				</ce-breadcrumb>
			</ce-breadcrumbs>

			<?php
			if ( ! empty( User::current()->customerId( 'live' ) ) ) {
				$customer = Customer::with( [ 'shipping_address', 'billing_address', 'tax_identifier' ] )->find( User::current()->customerId( 'live' ) );
				echo wp_kses_post(
					Component::tag( 'ce-customer-edit' )
					->id( 'customer-customer-edit' )
					->with(
						[
							'header'     => __( 'Update Billing Details', 'surecart' ),
							'customer'   => $customer,
							'successUrl' => esc_url( $back ),
						]
					)->render()
				);
			}

			if ( ! empty( User::current()->customerId( 'test' ) ) ) {
				$customer = Customer::with( [ 'shipping_address', 'billing_address', 'tax_identifier' ] )->find( User::current()->customerId( 'test' ) );
				echo wp_kses_post(
					Component::tag( 'ce-customer-edit' )
					->id( 'customer-customer-edit' )
					->with(
						[
							'header'     => __( 'Update Billing Details', 'surecart' ),
							'customer'   => $customer,
							'successUrl' => esc_url( $back ),
						]
					)->render()
				);
			}
			?>
		</ce-spacing>

			<?php
			return ob_get_clean();
	}
}
