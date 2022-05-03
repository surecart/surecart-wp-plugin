<?php
namespace SureCartBlocks\Controllers;

use SureCart\Models\Component;
use SureCart\Models\Customer;
use SureCart\Models\User;

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
			$output .= '<sc-dashboard-customer-details customer-id="' . User::current()->customerId( 'test' ) . '"></sc-dashboard-customer-details>';
		}
		// show live.
		if ( ! empty( User::current()->customerId( 'live' ) ) ) {
			$output .= '<sc-dashboard-customer-details customer-id="' . User::current()->customerId( 'live' ) . '"></sc-dashboard-customer-details>';
		}

		return $output;
	}

	/**
	 * Show a view to add a payment method.
	 *
	 * @return function
	 */
	public function edit() {
		$back = add_query_arg( [ 'tab' => $this->getTab() ], \SureCart::pages()->url( 'dashboard' ) );
		$id   = $this->getId();

		if ( ! current_user_can( 'edit_sc_customer', $id, [] ) ) {
			wp_die( 'You are not allowed to edit this customer', 'surecart' );
		}

		ob_start(); ?>

		<sc-spacing style="--spacing: var(--sc-spacing-large)">
			<sc-breadcrumbs>
				<sc-breadcrumb href="<?php echo esc_url( $back ); ?>">
					<?php esc_html_e( 'Dashboard', 'surecart' ); ?>
				</sc-breadcrumb>
				<sc-breadcrumb>
					<?php esc_html_e( 'Billing Details', 'surecart' ); ?>
				</sc-breadcrumb>
			</sc-breadcrumbs>

			<?php
			$customer = Customer::with( [ 'shipping_address', 'billing_address', 'tax_identifier' ] )->find( $id );
			if ( ! $customer ) {
				return;
			}
			echo wp_kses_post(
				Component::tag( 'sc-customer-edit' )
				->id( 'customer-customer-edit-live' )
				->with(
					[
						'header'     => __( 'Update Billing Details', 'surecart' ),
						'customer'   => $customer,
						'successUrl' => esc_url_raw( $back ),
					]
				)->render()
			);
			?>
		</sc-spacing>

			<?php
			return ob_get_clean();
	}
}
