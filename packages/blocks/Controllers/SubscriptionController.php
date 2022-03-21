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
	 * @param array $attributes Block attributes.
	 * @return function
	 */
	public function preview( $attributes = [] ) {
		return wp_kses_post(
			Component::tag( 'ce-subscriptions-list' )
			->id( 'customer-subscriptions-preview' )
			->with(
				[
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
			)->render( $attributes['title'] ? "<span slot='heading'>" . $attributes['title'] . '</span>' : '' )
		);
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
				'heading' => $attributes['title'] ?? __( 'Subscriptions', 'surecart' ),
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
					<?php esc_html_e( 'Dashboard', 'surecart' ); ?>
				</ce-breadcrumb>
				<ce-breadcrumb>
					<?php esc_html_e( 'Subscription', 'surecart' ); ?>
				</ce-breadcrumb>
			</ce-breadcrumbs>

		<?php
			echo wp_kses_post(
				Component::tag( 'ce-subscription' )
				->id( 'customer-subscription-edit' )
				->with(
					[
						'heading'      => __( 'Current Plan', 'surecart' ),
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
						'heading'        => __( 'Update Plan', 'surecart' ),
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
	 * Get the terms text.
	 */
	public function getTermsText() {
		$account     = \CheckoutEngine::account();
		$privacy_url = $account->portal_protocol->privacy_url ?? \get_privacy_policy_url();
		$terms_url   = $account->portal_protocol->terms_url ?? '';

		if ( ! empty( $privacy_url ) && ! empty( $terms_url ) ) {
			return sprintf( __( 'By updating or canceling your plan, you agree to the <a href="%1$1s" target="_blank">%2$2s</a> and <a href="%3$3s" target="_blank">%4$4s</a>', 'surecart' ), esc_url( $terms_url ), __( 'Terms', 'surecart' ), esc_url( $privacy_url ), __( 'Privacy Policy', 'surecart' ) );
		}

		if ( ! empty( $privacy_url ) ) {
			return sprintf( __( 'By updating or canceling your plan, you agree to the <a href="%1$1s" target="_blank">%2$2s</a>', 'surecart' ), esc_url( $privacy_url ), __( 'Privacy Policy', 'surecart' ) );
		}

		if ( ! empty( $terms_url ) ) {
			return sprintf( __( 'By updating or canceling your plan, you agree to the <a href="%1$1s" target="_blank">%2$2s</a>', 'surecart' ), esc_url( $terms_url ), __( 'Terms', 'surecart' ) );
		}

		return '';
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
					<?php esc_html_e( 'Dashboard', 'surecart' ); ?>
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
					<?php esc_html_e( 'Subscription', 'surecart' ); ?>
				</ce-breadcrumb>
				<ce-breadcrumb>
					<?php esc_html_e( 'Confirm', 'surecart' ); ?>
				</ce-breadcrumb>
			</ce-breadcrumbs>

			<?php
			$terms = $this->getTermsText();

			echo wp_kses_post(
				Component::tag( 'ce-upcoming-invoice' )
				->id( 'customer-upcoming-invoice' )
				->with(
					[
						'heading'        => __( 'New Plan', 'surecart' ),
						'subscriptionId' => $this->getId(),
						'priceId'        => $this->getParam( 'price_id' ),
						'successUrl'     => esc_url( $back ),
						'quantity'       => 1,
					]
				)->render( $terms ? '<span slot="terms">' . wp_kses_post( $terms ) . '</span>' : '' )
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
					<?php esc_html_e( 'Dashboard', 'surecart' ); ?>
				</ce-breadcrumb>
				<ce-breadcrumb href="<?php echo esc_url( $edit_subscription_url ); ?>" >
					<?php esc_html_e( 'Subscription', 'surecart' ); ?>
				</ce-breadcrumb>
				<ce-breadcrumb>
					<?php esc_html_e( 'Cancel', 'surecart' ); ?>
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
					<?php esc_html_e( 'Dashboard', 'surecart' ); ?>
				</ce-breadcrumb>
				<ce-breadcrumb href="<?php echo esc_url( $edit_subscription_url ); ?>" >
					<?php esc_html_e( 'Subscription', 'surecart' ); ?>
				</ce-breadcrumb>
				<ce-breadcrumb>
					<?php esc_html_e( 'Renew', 'surecart' ); ?>
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

		$subscription = Subscription::find( $this->getId() );
		ob_start();
		?>

		<ce-spacing style="--spacing: var(--ce-spacing-xx-large)">
			<ce-breadcrumbs>
				<ce-breadcrumb href="<?php echo esc_url( $back_url ); ?>">
					<?php esc_html_e( 'Dashboard', 'surecart' ); ?>
				</ce-breadcrumb>
				<ce-breadcrumb href="<?php echo esc_url( $edit_subscription_url ); ?>">
					<?php esc_html_e( 'Subscription', 'surecart' ); ?>
				</ce-breadcrumb>
				<ce-breadcrumb href="<?php echo esc_url( $confirm_subscription_url ); ?>">
					<?php esc_html_e( 'Confirm', 'surecart' ); ?>
				</ce-breadcrumb>
				<ce-breadcrumb>
					<?php esc_html_e( 'Payment Method', 'surecart' ); ?>
				</ce-breadcrumb>
			</ce-breadcrumbs>

			<?php
			echo wp_kses_post(
				Component::tag( 'ce-subscription-payment' )
				->id( 'customer-subscription-payment' )
				->with(
					[
						'customerIds'  => $this->customerIds(),
						'subscription' => $subscription,
						'backUrl'      => esc_url_raw( $confirm_subscription_url ),
						'successUrl'   => esc_url_raw( $confirm_subscription_url ),
						'quantity'     => 1,
					]
				)->render()
			);
			?>
		</ce-spacing>

		<?php
		return ob_get_clean();
	}
}
