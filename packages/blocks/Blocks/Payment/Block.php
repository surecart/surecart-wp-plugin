<?php

namespace SureCartBlocks\Blocks\Payment;

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
		$processors = Processor::where( [ 'live_mode' => $mode === 'live' ] )->get();

		$key    = array_search( 'stripe', array_column( $processors, 'processor_type' ), true );
		$stripe = $processors[ $key ] ?? null;

		ob_start();
		?>

		<sc-payment
			class="<?php echo esc_attr( $attributes['className'] ?? '' ); ?>"
			label="<?php echo esc_attr( $attributes['label'] ?? '' ); ?>"
			default-processor="<?php echo esc_attr( $attributes['default_processor'] ); ?>"
			secure-notice="<?php echo esc_attr( $attributes['secure_notice'] ); ?>"
		>
			<?php $this->renderStripe( $processors, $mode ); ?>

		</sc-payment>
		<?php
		return ob_get_clean();
	}

	protected function renderStripe( $processors, $mode ) {
		$key    = array_search( 'stripe', array_column( $processors, 'processor_type' ), true );
		$stripe = $processors[ $key ] ?? null;
		?>

		<sc-payment-method-choice>
			<span slot="summary" class="sc-payment-toggle-summary">
				<sc-icon name="credit-card" style="font-size: 24px"></sc-icon>
				<span><?php esc_html_e( 'Credit Card', 'surecart' ); ?></span>
			</span>

			<div class="sc-payment__stripe-card-element">
				<sc-stripe-element
					mode="<?php echo esc_attr( $mode ); ?>"
					account-id="<?php echo esc_attr( $stripe->processor_data->account_id ?? null ); ?>"
					publishable-key="<?php echo esc_attr( $stripe->processor_data->publishable_key ?? null ); ?>"/>

				<?php if ( ! empty( $attributes['secure_notice'] ) ) : ?>
					<sc-secure-notice>
						<?php echo wp_kses_post( $attributes['secure_notice'] ); ?>
					</sc-secure-notice>
				<?php endif; ?>
			</div>
		</sc-payment-method-choice>

		<?php
	}
}
