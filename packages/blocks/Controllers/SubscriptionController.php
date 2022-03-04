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
				'product',
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
		if ( ! empty( $subscription->price->product->product_group ) ) {
			echo wp_kses_post(
				Component::tag( 'ce-subscription-switch' )
				->id( 'customer-subscription-switch' )
				->with(
					[
						'heading'        => __( 'Update Subscription', 'checkout-engine' ),
						'productGroupId' => $subscription->price->product->product_group,
						'subscription'   => $subscription,
					]
				)->render()
			);
		}
		?>
		</ce-spacing>

		<?php
		return ob_get_clean();
	}

	/**
	 * Confirm changing subscription
	 *
	 * @return function
	 */
	public function confirm() {
		$back = add_query_arg( [ 'tab' => $this->getTab() ], \CheckoutEngine::pages()->url( 'dashboard' ) );
		ob_start();
		?>
	<ce-spacing style="--spacing: var(--ce-spacing-xx-large)">
			<ce-breadcrumbs>
				<ce-breadcrumb href="<?php echo esc_url( add_query_arg( [ 'tab' => $this->getTab() ], \CheckoutEngine::pages()->url( 'dashboard' ) ) ); ?>">
					<?php esc_html_e( 'Dashboard', 'checkout_engine' ); ?>
				</ce-breadcrumb>
				<ce-breadcrumb href="
				<?php
				echo esc_url(
					add_query_arg(
						[
							'tab'    => $this->getTab(),
							'action' => 'edit',
							'model'  => 'subscription',
							'id'     => $this->getId(),
						],
						\CheckoutEngine::pages()->url( 'dashboard' )
					)
				);
				?>
				">
					<?php esc_html_e( 'Subscription', 'checkout_engine' ); ?>
				</ce-breadcrumb>
				<ce-breadcrumb>
					<?php esc_html_e( 'Confirm', 'checkout_engine' ); ?>
				</ce-breadcrumb>
			</ce-breadcrumbs>

			<?php
			echo wp_kses_post(
				Component::tag( 'ce-upcoming-invoice' )
				->id( 'customer-upcoming-invoice' )
				->with(
					[
						'heading'        => __( 'New Plan', 'checkout-engine' ),
						'subscriptionId' => $this->getId(),
						'priceId'        => $this->getParam( 'price_id' ),
						'successUrl'     => esc_url( $back ),
						'quantity'       => 1,
					]
				)->render()
			);
			?>


	</ce-spacing>

		<?php
		return ob_get_clean();

	}
}
