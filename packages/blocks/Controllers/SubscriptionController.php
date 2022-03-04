<?php
namespace CheckoutEngineBlocks\Controllers;

use CheckoutEngine\Models\Component;
use CheckoutEngine\Models\Subscription;
use CheckoutEngine\Models\SubscriptionProtocol;
use CheckoutEngine\Models\User;

/**
 * The subscription controller.
 */
class SubscriptionController extends BaseController {
	/**
	 * Render the block
	 *
	 * @return function
	 */
	public function preview() {
		\CheckoutEngine::assets()->addComponentData(
			'ce-subscriptions-list',
			'#customer-subscriptions-preview',
			[
				'heading' => $attributes['title'] ?? __( 'Subscriptions', 'checkout-engine' ),
				'allLink' => add_query_arg(
					[
						'tab'    => $this->getTab(),
						'model'  => 'subscription',
						'action' => 'index',
					],
					\CheckoutEngine::pages()->url( 'dashboard' )
				),
				'query'   => [
					'customer_ids' => array_values( User::current()->customerIds() ),
					'status'       => [ 'active', 'trialing' ],
					'page'         => 1,
					'per_page'     => 5,
				],
			]
		);
		return '<ce-subscriptions-list id="customer-subscriptions-preview"></ce-subscriptions-list>';
	}

	/**
	 * Render the block
	 *
	 * @return function
	 */
	public function index() {
		\CheckoutEngine::assets()->addComponentData(
			'ce-subscriptions-list',
			'#customer-subscriptions-index',
			[
				'heading' => $attributes['title'] ?? __( 'Subscriptions', 'checkout-engine' ),
				'query'   => [
					'customer_ids' => array_values( User::current()->customerIds() ),
					'status'       => [ 'active', 'trialing', 'canceled' ],
					'page'         => 1,
					'per_page'     => 20,
				],
			]
		);
		return '<ce-subscriptions-list id="customer-subscriptions-index"></ce-subscriptions-list>';
	}

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
						'heading'      => __( 'Current Plan', 'checkout-engine' ),
						'subscription' => $subscription,
					]
				)->render()
			);
		?>

		<?php
		if ( ! empty( $subscription->price->product->product_group )
		&& ! $subscription->cancel_at_period_end && 'canceled' !== $subscription->status
		&& $subscription->current_period_end_at ) {
			echo wp_kses_post(
				Component::tag( 'ce-subscription-switch' )
				->id( 'customer-subscription-switch' )
				->with(
					[
						'heading'        => __( 'Update Plan', 'checkout-engine' ),
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

	/**
	 * Confirm cancel subscription
	 *
	 * @return function
	 */
	public function cancel() {
		$back_url              = add_query_arg( [ 'tab' => $this->getTab() ], \CheckoutEngine::pages()->url( 'dashboard' ) );
		$edit_subscription_url = add_query_arg(
			[
				'tab'    => $this->getTab(),
				'action' => 'edit',
				'model'  => 'subscription',
				'id'     => $this->getId(),
			],
			\CheckoutEngine::pages()->url( 'dashboard' )
		);
		ob_start();
		?>
		<ce-spacing style="--spacing: var(--ce-spacing-xx-large)">
			<ce-breadcrumbs>
				<ce-breadcrumb href="<?php echo esc_url( $back_url ); ?>">
					<?php esc_html_e( 'Dashboard', 'checkout_engine' ); ?>
				</ce-breadcrumb>
				<ce-breadcrumb href="<?php echo esc_url( $edit_subscription_url ); ?>" >
					<?php esc_html_e( 'Subscription', 'checkout_engine' ); ?>
				</ce-breadcrumb>
				<ce-breadcrumb>
					<?php esc_html_e( 'Cancel', 'checkout_engine' ); ?>
				</ce-breadcrumb>
			</ce-breadcrumbs>

			<?php
			echo wp_kses_post(
				Component::tag( 'ce-subscription-cancel' )
				->id( 'customer-subscription-cancel' )
				->with(
					[
						'subscriptionId' => $this->getId(),
						'backUrl'        => esc_url_raw( $edit_subscription_url ),
						'successUrl'     => esc_url_raw( $back_url ),
					]
				)->render()
			);
			?>

		</ce-spacing>
		<?php
		return ob_get_clean();
	}

	/**
	 * Confirm renew subscription
	 *
	 * @return function
	 */
	public function renew() {
		$back_url              = add_query_arg( [ 'tab' => $this->getTab() ], \CheckoutEngine::pages()->url( 'dashboard' ) );
		$edit_subscription_url = add_query_arg(
			[
				'tab'    => $this->getTab(),
				'action' => 'edit',
				'model'  => 'subscription',
				'id'     => $this->getId(),
			],
			\CheckoutEngine::pages()->url( 'dashboard' )
		);
		ob_start();
		?>
		<ce-spacing style="--spacing: var(--ce-spacing-xx-large)">
			<ce-breadcrumbs>
				<ce-breadcrumb href="<?php echo esc_url( $back_url ); ?>">
					<?php esc_html_e( 'Dashboard', 'checkout_engine' ); ?>
				</ce-breadcrumb>
				<ce-breadcrumb href="<?php echo esc_url( $edit_subscription_url ); ?>" >
					<?php esc_html_e( 'Subscription', 'checkout_engine' ); ?>
				</ce-breadcrumb>
				<ce-breadcrumb>
					<?php esc_html_e( 'Renew', 'checkout_engine' ); ?>
				</ce-breadcrumb>
			</ce-breadcrumbs>

			<?php
			echo wp_kses_post(
				Component::tag( 'ce-subscription-renew' )
				->id( 'customer-subscription-renew' )
				->with(
					[
						'subscriptionId' => $this->getId(),
						'backUrl'        => esc_url_raw( $edit_subscription_url ),
						'successUrl'     => esc_url_raw( $back_url ),
					]
				)->render()
			);
			?>

		</ce-spacing>
		<?php
		return ob_get_clean();
	}

	/**
	 * Update payment
	 *
	 * @return function
	 */
	public function payment() {
		$back_url = add_query_arg( [ 'tab' => $this->getTab() ], \CheckoutEngine::pages()->url( 'dashboard' ) );

		$edit_subscription_url = add_query_arg(
			[
				'tab'    => $this->getTab(),
				'action' => 'edit',
				'model'  => 'subscription',
				'id'     => $this->getId(),
			],
			\CheckoutEngine::pages()->url( 'dashboard' )
		);

		$confirm_subscription_url = add_query_arg(
			[
				'tab'      => $this->getTab(),
				'action'   => 'confirm',
				'model'    => 'subscription',
				'id'       => $this->getId(),
				'price_id' => $this->getParam( 'price_id' ),
			],
			\CheckoutEngine::pages()->url( 'dashboard' )
		);
		ob_start();
		?>

		<ce-spacing style="--spacing: var(--ce-spacing-xx-large)">
			<ce-breadcrumbs>
				<ce-breadcrumb href="<?php echo esc_url( $back_url ); ?>">
					<?php esc_html_e( 'Dashboard', 'checkout_engine' ); ?>
				</ce-breadcrumb>
				<ce-breadcrumb href="<?php echo esc_url( $edit_subscription_url ); ?>">
					<?php esc_html_e( 'Subscription', 'checkout_engine' ); ?>
				</ce-breadcrumb>
				<ce-breadcrumb href="<?php echo esc_url( $confirm_subscription_url ); ?>">
					<?php esc_html_e( 'Confirm', 'checkout_engine' ); ?>
				</ce-breadcrumb>
				<ce-breadcrumb>
					<?php esc_html_e( 'Payment Method', 'checkout_engine' ); ?>
				</ce-breadcrumb>
			</ce-breadcrumbs>

			<?php
			echo wp_kses_post(
				Component::tag( 'ce-subscription-payment' )
				->id( 'customer-subscription-payment' )
				->with(
					[
						'customerIds'    => $this->customerIds(),
						'subscriptionId' => $this->getId(),
						'successUrl'     => esc_url_raw( $confirm_subscription_url ),
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
