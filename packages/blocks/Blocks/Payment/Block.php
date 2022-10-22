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
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content ) {

		// get the mode context.
		$mode       = $this->block->context['surecart/form/mode'] ?? 'live';
		$processors = Processor::where( [ 'live_mode' => 'test' === $mode ? false : true ] )->get();

		ob_start();
		?>

		<sc-payment
			class="<?php echo esc_attr( $attributes['className'] ?? '' ); ?>"
			label="<?php echo esc_attr( $attributes['label'] ?? '' ); ?>"
			default-processor="<?php echo esc_attr( $attributes['default_processor'] ); ?>"
			secure-notice="<?php echo esc_attr( $attributes['secure_notice'] ); ?>"
		>
			<?php $this->renderStripe( $processors, $mode ); ?>
			<?php $this->renderPayPal( $processors ); ?>
			<?php $this->renderManualPaymentMethods(); ?>
		</sc-payment>
		<?php
		return ob_get_clean();
	}

	/**
	 * Get the processor by type.
	 *
	 * @param string $type The processor type.
	 * @param array  $processors Array of processors.
	 */
	protected function getProcessorByType( $type, $processors ) {
		$key = array_search( $type, array_column( $processors, 'processor_type' ), true );
		if ( ! is_int( $key ) ) {
			return null;
		}
		return $processors[ $key ] ?? null;
	}

	/**
	 * Render Stripe payment method choice.
	 *
	 * @param array  $processors Array of processors.
	 * @param string $mode Live mode or test mode.
	 *
	 * @return void
	 */
	protected function renderStripe( $processors, $mode ) {
		$processor = $this->getProcessorByType( 'stripe', $processors );
		if ( ! $processor ) {
			return;
		}
		$payment_element = (bool) get_option( 'sc_stripe_payment_element', false );
		?>

		<sc-payment-method-choice
			processor-id="stripe"
		<?php echo $processor->recurring_enabled ? 'recurring-enabled' : null; ?>
			has-others>
			<span slot="summary" class="sc-payment-toggle-summary">
				<sc-icon name="credit-card" style="font-size: 24px"></sc-icon>
				<span><?php esc_html_e( 'Credit Card', 'surecart' ); ?></span>
			</span>

			<div class="sc-payment__stripe-card-element">
				<?php if ( $payment_element ) : ?>
					<sc-stripe-payment-element order={this.order} paymentIntent={this.stripePaymentIntent} />
				<?php else : ?>
					<sc-stripe-element
					mode="<?php echo esc_attr( $mode ); ?>"
					account-id="<?php echo esc_attr( $processor->processor_data->account_id ?? null ); ?>"
					publishable-key="<?php echo esc_attr( $processor->processor_data->publishable_key ?? null ); ?>"/>

					<?php if ( ! empty( $attributes['secure_notice'] ) ) : ?>
						<sc-secure-notice>
							<?php echo wp_kses_post( $attributes['secure_notice'] ); ?>
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
		$processor = $this->getProcessorByType( 'paypal', $processors );
		if ( ! $processor ) {
			return;
		}
		?>

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
		?>
		<?php $methods = (array) ManualPaymentMethod::where( [ 'archived' => false ] )->get() ?? []; ?>

		<?php foreach ( $methods as $method ) : ?>
			<sc-payment-method-choice
			processor-id="<?php echo esc_attr( $method->id ); ?>"
			has-others>

			<span slot="summary">
				<?php echo esc_html( $method->name ); ?>
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
