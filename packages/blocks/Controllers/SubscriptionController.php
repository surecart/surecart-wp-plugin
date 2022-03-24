<?php
namespace SureCartBlocks\Controllers;

use SureCart\Models\Component;
use SureCart\Models\Subscription;
use SureCart\Models\SubscriptionProtocol;
use SureCart\Models\User;

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
			Component::tag( 'sc-subscriptions-list' )
			->id( 'customer-subscriptions-preview' )
			->with(
				[
					'allLink' => add_query_arg(
						[
							'tab'    => $this->getTab(),
							'model'  => 'subscription',
							'action' => 'index',
						],
						\SureCart::pages()->url( 'dashboard' )
					),
					'query'   => [
						'customer_ids' => array_values( User::current()->customerIds() ),
						'status'       => [ 'active', 'trialing', 'past_due', 'canceled' ],
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
		\SureCart::assets()->addComponentData(
			'sc-subscriptions-list',
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
		return '<sc-subscriptions-list id="customer-subscriptions-index"></sc-subscriptions-list>';
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

		<sc-spacing style="--spacing: var(--sc-spacing-large)">
			<sc-breadcrumbs>
				<sc-breadcrumb href="<?php echo esc_url( add_query_arg( [ 'tab' => $this->getTab() ], \SureCart::pages()->url( 'dashboard' ) ) ); ?>">
					<?php esc_html_e( 'Dashboard', 'surecart' ); ?>
				</sc-breadcrumb>
				<sc-breadcrumb>
					<?php esc_html_e( 'Subscription', 'surecart' ); ?>
				</sc-breadcrumb>
			</sc-breadcrumbs>

		<?php
			echo wp_kses_post(
				Component::tag( 'sc-subscription' )
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
		// show switch if we can change it.
		if ( $subscription->canBeSwitched() ) :
			echo wp_kses_post(
				Component::tag( 'sc-subscription-switch' )
				->id( 'customer-subscription-switch' )
				->with(
					[
						'heading'        => __( 'Update Plan', 'surecart' ),
						'productId'      => $subscription->price->product->id,
						'productGroupId' => $subscription->price->product->product_group,
						'subscription'   => $subscription,
					]
				)->render()
			);
		endif;
		?>

		</sc-spacing>

		<?php
		return ob_get_clean();
	}

	/**
	 * Get the terms text.
	 */
	public function getTermsText() {
		$account     = \SureCart::account();
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
		$back = add_query_arg( [ 'tab' => $this->getTab() ], \SureCart::pages()->url( 'dashboard' ) );
		ob_start();
		?>

		<sc-spacing style="--spacing: var(--sc-spacing-xx-large)">
			<sc-breadcrumbs>
				<sc-breadcrumb href="<?php echo esc_url( add_query_arg( [ 'tab' => $this->getTab() ], \SureCart::pages()->url( 'dashboard' ) ) ); ?>">
					<?php esc_html_e( 'Dashboard', 'surecart' ); ?>
				</sc-breadcrumb>
				<sc-breadcrumb href="
				<?php
				echo esc_url(
					add_query_arg(
						[
							'tab'    => $this->getTab(),
							'action' => 'edit',
							'model'  => 'subscription',
							'id'     => $this->getId(),
						],
						\SureCart::pages()->url( 'dashboard' )
					)
				);
				?>
				">
					<?php esc_html_e( 'Subscription', 'surecart' ); ?>
				</sc-breadcrumb>
				<sc-breadcrumb>
					<?php esc_html_e( 'Confirm', 'surecart' ); ?>
				</sc-breadcrumb>
			</sc-breadcrumbs>

			<?php
			$terms = $this->getTermsText();

			echo wp_kses_post(
				Component::tag( 'sc-upcoming-invoice' )
				->id( 'customer-upcoming-invoice' )
				->with(
					[
						'heading'                => __( 'New Plan', 'surecart' ),
						'subscriptionId'         => $this->getId(),
						'priceId'                => $this->getParam( 'price_id' ),
						'successUrl'             => esc_url( $back ),
						'quantityUpdatesEnabled' => \SureCart::account()->portal_protocol->subscription_quantity_updates_enabled,
						'quantity'               => 1,
					]
				)->render( $terms ? '<span slot="terms">' . wp_kses_post( $terms ) . '</span>' : '' )
			);
			?>


	</sc-spacing>

		<?php
		return ob_get_clean();

	}

	/**
	 * Confirm cancel subscription
	 *
	 * @return function
	 */
	public function cancel() {
		$back_url              = add_query_arg( [ 'tab' => $this->getTab() ], \SureCart::pages()->url( 'dashboard' ) );
		$edit_subscription_url = add_query_arg(
			[
				'tab'    => $this->getTab(),
				'action' => 'edit',
				'model'  => 'subscription',
				'id'     => $this->getId(),
			],
			\SureCart::pages()->url( 'dashboard' )
		);
		ob_start();
		?>
		<sc-spacing style="--spacing: var(--sc-spacing-xx-large)">
			<sc-breadcrumbs>
				<sc-breadcrumb href="<?php echo esc_url( $back_url ); ?>">
					<?php esc_html_e( 'Dashboard', 'surecart' ); ?>
				</sc-breadcrumb>
				<sc-breadcrumb href="<?php echo esc_url( $edit_subscription_url ); ?>" >
					<?php esc_html_e( 'Subscription', 'surecart' ); ?>
				</sc-breadcrumb>
				<sc-breadcrumb>
					<?php esc_html_e( 'Cancel', 'surecart' ); ?>
				</sc-breadcrumb>
			</sc-breadcrumbs>

			<?php
			echo wp_kses_post(
				Component::tag( 'sc-subscription-cancel' )
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

		</sc-spacing>
		<?php
		return ob_get_clean();
	}

	/**
	 * Confirm renew subscription
	 *
	 * @return function
	 */
	public function renew() {
		$back_url              = add_query_arg( [ 'tab' => $this->getTab() ], \SureCart::pages()->url( 'dashboard' ) );
		$edit_subscription_url = add_query_arg(
			[
				'tab'    => $this->getTab(),
				'action' => 'edit',
				'model'  => 'subscription',
				'id'     => $this->getId(),
			],
			\SureCart::pages()->url( 'dashboard' )
		);
		ob_start();
		?>
		<sc-spacing style="--spacing: var(--sc-spacing-xx-large)">
			<sc-breadcrumbs>
				<sc-breadcrumb href="<?php echo esc_url( $back_url ); ?>">
					<?php esc_html_e( 'Dashboard', 'surecart' ); ?>
				</sc-breadcrumb>
				<sc-breadcrumb href="<?php echo esc_url( $edit_subscription_url ); ?>" >
					<?php esc_html_e( 'Subscription', 'surecart' ); ?>
				</sc-breadcrumb>
				<sc-breadcrumb>
					<?php esc_html_e( 'Renew', 'surecart' ); ?>
				</sc-breadcrumb>
			</sc-breadcrumbs>

			<?php
			echo wp_kses_post(
				Component::tag( 'sc-subscription-renew' )
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

		</sc-spacing>
		<?php
		return ob_get_clean();
	}

	/**
	 * Update payment
	 *
	 * @return function
	 */
	public function payment() {
		$back_url = add_query_arg( [ 'tab' => $this->getTab() ], \SureCart::pages()->url( 'dashboard' ) );

		$edit_subscription_url = add_query_arg(
			[
				'tab'    => $this->getTab(),
				'action' => 'edit',
				'model'  => 'subscription',
				'id'     => $this->getId(),
			],
			\SureCart::pages()->url( 'dashboard' )
		);

		$confirm_subscription_url = add_query_arg(
			[
				'tab'      => $this->getTab(),
				'action'   => 'confirm',
				'model'    => 'subscription',
				'id'       => $this->getId(),
				'price_id' => $this->getParam( 'price_id' ),
			],
			\SureCart::pages()->url( 'dashboard' )
		);

		$subscription = Subscription::find( $this->getId() );
		ob_start();
		?>

		<sc-spacing style="--spacing: var(--sc-spacing-xx-large)">
			<sc-breadcrumbs>
				<sc-breadcrumb href="<?php echo esc_url( $back_url ); ?>">
					<?php esc_html_e( 'Dashboard', 'surecart' ); ?>
				</sc-breadcrumb>
				<sc-breadcrumb href="<?php echo esc_url( $edit_subscription_url ); ?>">
					<?php esc_html_e( 'Subscription', 'surecart' ); ?>
				</sc-breadcrumb>
				<sc-breadcrumb href="<?php echo esc_url( $confirm_subscription_url ); ?>">
					<?php esc_html_e( 'Confirm', 'surecart' ); ?>
				</sc-breadcrumb>
				<sc-breadcrumb>
					<?php esc_html_e( 'Payment Method', 'surecart' ); ?>
				</sc-breadcrumb>
			</sc-breadcrumbs>

			<?php
			echo wp_kses_post(
				Component::tag( 'sc-subscription-payment' )
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
		</sc-spacing>

		<?php
		return ob_get_clean();
	}
}
