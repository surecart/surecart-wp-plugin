<?php

namespace SureCartBlocks\Blocks\Payment;

use SureCart\Models\ManualPaymentMethod;
use SureCart\Models\Processor;
use SureCartBlocks\Blocks\BaseBlock;

/**
 * Checkout block
 */
class Block extends BaseBlock {
	/**
	 * Keep track of number of instances.
	 *
	 * @var integer
	 */
	public static $instance = 0;

	/**
	 * Attributes.
	 *
	 * @var array
	 */
	private $attributes = [];

	/**
	 * Is the processor enabled?
	 *
	 * @return boolean
	 */
	public function processorEnabled( $id ) {
		return ! in_array( $id, $this->attributes['disabled_methods'] ?? [] );
	}

	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {
		$this->attributes = $attributes;
		$this->mode       = $this->block->context['surecart/form/mode'] ?? 'live';

		\SureCart::assets()->addComponentData(
			'sc-payment',
			'#sc-payment-' . (int) self::$instance,
			[
				'label'                => $attributes['label'] ?? '',
				'processors'           => Processor::where( [ 'live_mode' => 'test' === $this->mode ? false : true ] )->get(),
				'default_processor'    => $attributes['default_processor'] ?? null,
				'manualPaymentMethods' => ManualPaymentMethod::where( [ 'archived' => false ] )->get() ?? [],
				'secureNotice'         => $attributes['secure_notice'],
			]
		);

		$processors        = Processor::where( [ 'live_mode' => 'test' === $this->mode ? false : true ] )->get();
		$has_mollie        = (bool) $this->getProcessorByType( 'mollie', $processors )->enabled ?? false;
		$default_processor = $has_mollie ? 'mollie' : ( $attributes['default_processor'] ?? null );
		$stripe            = $this->getProcessorByType( 'stripe', $processors ) ?? null;
		$payment_element   = (bool) get_option( 'sc_stripe_payment_element', false );

		ob_start();
		?>

		<sc-payment
			id="<?php echo esc_attr( 'sc-payment-' . (int) self::$instance ); ?>"
			class="<?php echo esc_attr( $attributes['className'] ?? '' ); ?>"
		>
			<?php if ( $payment_element ) : ?>
				<sc-stripe-payment-element slot="stripe"></sc-stripe-payment-element>
			<?php else : ?>
				<span slot="stripe">
					<sc-stripe-element
						mode="<?php echo esc_attr( $this->mode ); ?>"
						account-id="<?php echo esc_attr( $stripe->processor_data->account_id ?? null ); ?>"
						publishable-key="<?php echo esc_attr( $stripe->processor_data->publishable_key ?? null ); ?>">
					</sc-stripe-element>
					<?php if ( ! empty( $this->attributes['secure_notice'] ) ) : ?>
						<sc-secure-notice>
							<?php echo wp_kses_post( $this->attributes['secure_notice'] ); ?>
						</sc-secure-notice>
					<?php endif; ?>
				</span>
			<?php endif; ?>
		</sc-payment>
		<?php
		return ob_get_clean();
	}

	public function renderMollie( $processors ) {
		$processor = $this->getProcessorByType( 'mollie', $processors );
		?>
		<sc-checkout-mollie-payment processor-id="<?php echo esc_attr( $processor->id ); ?>">
			<?php $this->renderManualPaymentMethods(); ?>
		</sc-checkout-mollie-payment>
		<?php
	}

	/**
	 * Get the processor by type.
	 *
	 * @param string $type The processor type.
	 * @param array  $processors Array of processors.
	 *
	 * @return \SureCart/Models/Processor|null;
	 */
	protected function getProcessorByType( $type, $processors ) {
		if ( is_wp_error( $processors ) ) {
			return null;
		}

		$key = array_search( $type, array_column( (array) $processors, 'processor_type' ), true );
		if ( ! is_int( $key ) ) {
			return null;
		}
		return $processors[ $key ] ?? null;
	}

	/**
	 * Render Stripe payment method choice.
	 *
	 * @param array $processors Array of processors.
	 *
	 * @return void
	 */
	protected function renderStripe( $processors ) {
		if ( ! $this->processorEnabled( 'stripe' ) ) {
			return;
		}

		$processor = $this->getProcessorByType( 'stripe', $processors );
		if ( ! $processor ) {
			return;
		}
		$payment_element = (bool) get_option( 'sc_stripe_payment_element', false );
		?>

		<sc-payment-method-choice
			processor-id="stripe"
			card="<?php echo esc_attr( $payment_element ? 'true' : 'false' ); ?>"
			<?php echo $processor->recurring_enabled ? 'recurring-enabled' : null; ?>
			has-others>
			<span slot="summary" class="sc-payment-toggle-summary">
				<sc-icon name="credit-card" style="font-size: 24px"></sc-icon>
				<span><?php esc_html_e( 'Credit Card', 'surecart' ); ?></span>
			</span>

			<div class="sc-payment__stripe-card-element">
				<?php if ( $payment_element ) : ?>
					<sc-stripe-payment-element></sc-stripe-payment-element>
				<?php else : ?>
					<sc-stripe-element
					mode="<?php echo esc_attr( $this->mode ); ?>"
					account-id="<?php echo esc_attr( $processor->processor_data->account_id ?? null ); ?>"
					publishable-key="<?php echo esc_attr( $processor->processor_data->publishable_key ?? null ); ?>">
					</sc-stripe-element>
					<?php if ( ! empty( $this->attributes['secure_notice'] ) ) : ?>
						<sc-secure-notice>
							<?php echo wp_kses_post( $this->attributes['secure_notice'] ); ?>
						</sc-secure-notice>
					<?php endif; ?>
				<?php endif; ?>
			</div>
		</sc-payment-method-choice>

		<?php
	}

	/**
	 * Render PayPal Payment method
	 *
	 * @param array $processors Array of available processors.
	 *
	 * @return void
	 */
	protected function renderPayPal( $processors ) {
		if ( ! $this->processorEnabled( 'paypal' ) ) {
			return;
		}

		$stripe    = $this->getProcessorByType( 'stripe', $processors );
		$processor = $this->getProcessorByType( 'paypal', $processors );
		if ( ! $processor ) {
			return;
		}
		?>

		<?php if ( ! $stripe || ! $this->processorEnabled( 'stripe' ) ) : ?>
			<sc-payment-method-choice
				processor-id="paypal-card"
				<?php echo $processor->recurring_enabled ? 'recurring-enabled' : null; ?>
				has-others>
				<span slot="summary" class="sc-payment-toggle-summary">
					<sc-icon name="credit-card" style="font-size: 24px"></sc-icon>
					<span><?php esc_html_e( 'Credit Card', 'surecart' ); ?></span>
				</span>

				<sc-card>
					<sc-payment-selected label="<?php esc_attr_e( 'Credit Card selected for check out.', 'surecart' ); ?>">
						<sc-icon name="credit-card" slot="icon" style="font-size: 24px"></sc-icon>
						<?php esc_html_e( 'Another step will appear after submitting your order to complete your purchase details.', 'surecart' ); ?>
					</sc-payment-selected>
				</sc-card>
			</sc-payment-method-choice>
		<?php endif; ?>

		<sc-payment-method-choice
			processor-id="paypal"
			<?php echo $processor->recurring_enabled ? 'recurring-enabled' : null; ?>
			has-others>
			<span slot="summary" class="sc-payment-toggle-summary">
				<sc-icon name="paypal" style="width: 80px; font-size: 24px"></sc-icon>
			</span>

			<sc-card>
				<sc-payment-selected label="<?php esc_attr_e( 'PayPal selected for check out.', 'surecart' ); ?>">
					<sc-icon slot="icon" name="paypal" style="width: 80px"></sc-icon>
					<?php esc_html_e( 'Another step will appear after submitting your order to complete your purchase details.', 'surecart' ); ?>
				</sc-payment-selected>
			</sc-card>
		</sc-payment-method-choice>
		<?php
	}

	/**
	 * Render manual payment methods.
	 *
	 * @return void
	 */
	protected function renderManualPaymentMethods() {
		$methods = ManualPaymentMethod::where( [ 'archived' => false ] )->get() ?? [];

		if ( is_wp_error( $methods ) ) {
			?>
				<sc-alert open type="danger">
					<?php foreach ( $methods->get_error_messages() as $message ) : ?>
						<div>
							<?php echo esc_html( $message ); ?>
						</div>
					<?php endforeach; ?>
				</sc-alert>
			<?php
			return;
		}

		?>

		<?php foreach ( $methods as $method ) : ?>
			<?php
			if ( ! $this->processorEnabled( $method->id ) ) :
				continue;
			 endif;
			?>

			<sc-payment-method-choice
			is-manual
			processor-id="<?php echo esc_attr( $method->id ); ?>"
			has-others>

			<span slot="summary">
				<?php echo esc_html( apply_filters( 'surecart/manual_payment_method_choice/summary', $method->name, $method ) ); ?>
			</span>

			<sc-card>
				<sc-payment-selected label="
				<?php
				echo esc_attr(
					sprintf(
						// translators: Manual payment method.
						__( '%s selected for check out.', 'surecart' ),
						$method->name
					)
				);
				?>
					">
					<?php echo wp_kses_post( $method->description ?? '' ); ?>
				</sc-payment-selected>
			</sc-card>
		</sc-payment-method-choice>
		<?php endforeach; ?>
		<?php
	}
}
