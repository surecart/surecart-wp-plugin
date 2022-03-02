<?php
namespace CheckoutEngineBlocks\Controllers;

use CheckoutEngine\Models\Component;
use CheckoutEngine\Models\Subscription;

/**
 * The subscription controller.
 */
class SubscriptionController extends BaseController {
	/**
	 * Show and individual checkout session.
	 *
	 * @return function
	 */
	public function edit() {
		$id = $this->getId();

		if ( ! $id ) {
			return $this->notFound();
		}

		// fetch subscription.
		$subscription = Subscription::with(
			[
				'price',
				'price.product',
				'latest_invoice',
				'product.product_group',
			]
		)->find( $id );

		ob_start(); ?>

		<ce-spacing style="--spacing: var(--ce-spacing-large)">
			<ce-breadcrumbs>
				<ce-breadcrumb href="<?php echo esc_url( add_query_arg( [ 'tab' => $this->getTab() ], \CheckoutEngine::pages()->url( 'dashboard' ) ) ); ?>">
					<?php esc_html_e( 'Dashboard', 'checkout_engine' ); ?>
				</ce-breadcrumb>
				<ce-breadcrumb>
					<?php esc_html_e( 'Subscription', 'checkout_engine' ); ?>
				</ce-breadcrumb>
			</ce-breadcrumbs>

		<?php
			echo wp_kses_post(
				Component::tag( 'ce-subscription' )
				->id( 'customer-subscription-edit' )
				->with(
					[
						'listTitle'    => __( 'Update Subscription', 'checkout-engine' ),
						'subscription' => $subscription,
					]
				)->render()
			);
		?>

		<?php
			echo wp_kses_post(
				Component::tag( 'ce-subscription-switch' )
				->id( 'customer-subscription-switch' )
				->with(
					[
						'listTitle'     => __( 'Update Subscription', 'checkout-engine' ),
						'product-group' => $subscription->price->product->product_group ?? null,
						'subscription'  => $subscription,
					]
				)->render()
			);
		?>
		</ce-spacing>

		<?php
		return ob_get_clean();
	}
}
