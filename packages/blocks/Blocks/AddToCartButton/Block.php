<?php

namespace SureCartBlocks\Blocks\AddToCartButton;

use SureCart\Models\Form;
use SureCart\Models\Price;
/**
 * Logout Button Block.
 */
class Block extends \SureCartBlocks\Blocks\BuyButton\Block {
	/**
	 * Render the block
	 *
	 * @param array  $attributes Block attributes.
	 * @param string $content Post content.
	 *
	 * @return string
	 */
	public function render( $attributes, $content = '' ) {
		// need a price id.
		if ( empty( $attributes['price_id'] ) ) {
			return '';
		}

		$price = Price::find( $attributes['price_id'] );
		if ( empty( $price->id ) ) {
			return '';
		}

		// need a form for checkout.
		$form = \SureCart::forms()->getDefault();
		if ( empty( $form->ID ) ) {
			return '';
		}

		// Use backgroundColor and textColor if exist.
		$styles = '';
		if ( ! empty( $attributes['backgroundColor'] ) ) {
			$styles .= '--sc-color-primary-500: ' . $attributes['backgroundColor'] . '; ';
			$styles .= '--sc-focus-ring-color-primary: ' . $attributes['backgroundColor'] . '; ';
			$styles .= '--sc-input-border-color-focus: ' . $attributes['backgroundColor'] . '; ';
		}
		if ( ! empty( $attributes['textColor'] ) ) {
			$styles .= '--sc-color-primary-text: ' . $attributes['textColor'] . '; ';
		}

		// Slide-out is disabled, go directly to checkout.
		if ( (bool) get_option( 'sc_slide_out_cart_disabled', false ) ) {
			return \SureCart::block()->render(
				'blocks/buy-button',
				[
					'type'  => $attributes['type'] ?? 'primary',
					'size'  => $attributes['size'] ?? 'medium',
					'style' => $styles,
					'href'  => $this->href(
						[
							[
								'id'         => $price->id,
								'variant_id' => $attributes['variant_id'] ?? null,
								'quantity'   => 1,
							],
						]
					),
					'label' => $attributes['button_text'] ?? __( 'Buy Now', 'surecart' ),
				]
			);
		}

		ob_start(); ?>
		<div
			class="wp-block-buttons"
			data-wp-interactive='{ "namespace": "surecart/checkout" }'
			<?php
				echo wp_kses_data(
					wp_interactivity_data_wp_context(
						[
							'formId'    => intval( $form->ID ),
							'mode'      => esc_attr( Form::getMode( $form->ID ) ),
							'priceId'   => $attributes['price_id'] ?? null,
							'variantId' => $attributes['variant_id'] ?? null,
						]
					)
				);
				echo wp_kses_data( get_block_wrapper_attributes() );
			?>
		>
			<div class="wp-block-button">
				<button
					class="wp-block-button__link wp-element-button sc-button"
					data-wp-on--click="actions.addToCartByPriceOrVariant"
					data-wp-class--sc-button__link--busy="state.loading"
				>
					<span class="sc-spinner"></span>
					<span class="sc-button__link-text">
						<?php echo wp_kses_post( $attributes['button_text'] ); ?>
					</span>
				</button>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}
}
