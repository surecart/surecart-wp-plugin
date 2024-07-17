<?php

namespace SureCartBlocks\Blocks\AddToCartButton;

use SureCart\Models\Form;
use SureCart\Models\Price;

/**
 * AddToCart Button Block.
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

		$price = Price::with( [ 'product', 'product.variants' ] )->find( $attributes['price_id'] );
		if ( empty( $price->id ) ) {
			return '';
		}

		$product  = $price->product;
		$variants = $attributes['variant_id'] ? array_filter(
			$product->variants->data ?? [],
			function ( $variant ) use ( $attributes ) {
				return $variant->id == $attributes['variant_id'];
			}
		) : null;
		$variant  = $variants ? array_shift( $variants ) : null;

		// need a form for checkout.
		$form = \SureCart::forms()->getDefault();
		if ( empty( $form->ID ) ) {
			return '';
		}

		// Use backgroundColor and textColor if exist.
		$styles = '';
		if ( ! empty( $attributes['backgroundColor'] ) ) {
			$styles .= "background-color: {$attributes['backgroundColor']}; ";
		}
		if ( ! empty( $attributes['textColor'] ) ) {
			$styles .= "color: {$attributes['textColor']}; ";
		}

		$class = 'sc-button wp-element-button wp-block-button__link sc-button__link';

		// Slide-out is disabled, go directly to checkout.
		if ( (bool) get_option( 'sc_slide_out_cart_disabled', false ) ) {
			return \SureCart::block()->render(
				'blocks/buy-button',
				[
					'type'  => $attributes['type'] ?? 'primary',
					'size'  => $attributes['size'] ?? 'medium',
					'style' => $styles,
					'class' => $class,
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
			data-wp-interactive='{ "namespace": "surecart/product-page" }'
			<?php
			echo wp_kses_data(
				wp_interactivity_data_wp_context(
					array(
						'formId'                       => \SureCart::forms()->getDefaultId(),
						'mode'                         => \SureCart\Models\Form::getMode( \SureCart::forms()->getDefaultId() ),
						'checkoutUrl'                  => \SureCart::pages()->url( 'checkout' ),
						'product'                      => $product,
						'prices'                       => [ $price ],
						'selectedPrice'                => $price,
						'variant_options'              => $product->variant_options->data ?? array(),
						'variants'                     => $product->variants->data ?? array(),
						'selectedVariant'              => $variant,
						'quantity'                     => 1,
						'selectedDisplayAmount'        => $product->display_amount,
						'selectedScratchDisplayAmount' => ! empty( $product->initial_price ) ? $product->initial_price->scratch_display_amount : '',
						'isOnSale'                     => ! empty( $product->initial_price ) ? $product->initial_price->is_on_sale : false,
						'busy'                         => false,
						'adHocAmount'                  => '',
						'variantValues'                => (object) array_filter(
							array(
								'option_1' => $product->first_variant_with_stock->option_1 ?? null,
								'option_2' => $product->first_variant_with_stock->option_2 ?? null,
								'option_3' => $product->first_variant_with_stock->option_3 ?? null,
							)
						),
					)
				)
			);
			?>
		>
			<form class="sc-form" data-wp-on--submit="callbacks.handleSubmit">
				<?php if ( $price->ad_hoc ) : ?>
					<label for="sc-product-custom-amount" class="sc-form-label">
						<?php echo wp_kses_post( $attributes['ad_hoc_label'] ?? esc_html_e( 'Amount', 'surecart' ) ); ?>
					</label>
					<div class="sc-input-group">
						<span class="sc-input-group-text" id="basic-addon1" data-wp-text="context.selectedPrice.currency_symbol"></span>

						<input
							class="sc-form-control"
							id="sc-product-custom-amount"
							type="number"
							required
							placeholder="<?php echo esc_attr( $attributes['placeholder'] ?? '' ); ?>"
							data-wp-bind--min="context.selectedPrice.convertedAdHocMinAmount"
							data-wp-bind--max="context.selectedPrice.convertedAdHocMaxAmount"
							data-wp-bind--value="context.adHocAmount"
							data-wp-on--input="actions.setAdHocAmount"
						/>
					</div>
					<?php if ( ! empty( $attributes['help'] ) ) : ?>
						<div class="sc-help-text">
							<?php echo wp_kses_post( $attributes['help'] ); ?>
						</div>
					<?php endif; ?>
				<?php endif; ?>

				<div
					<?php
						echo wp_kses_data(
							get_block_wrapper_attributes(
								array(
									'class' => 'wp-block-button',
									'style' => $price->ad_hoc ? 'margin-top: 1rem;' : '',
								)
							)
						);
					?>
				>
					<button
						type="submit"
						class="<?php echo esc_attr( $class ); ?>"
						data-wp-class--sc-button__link--busy="context.busy"
						style="<?php echo esc_attr( $styles ); ?>"
					>
						<span class="sc-spinner" aria-hidden="true" data-wp-bind--hidden="!context.busy" hidden></span>
						<span class="sc-button__link-text">
							<?php echo wp_kses_post( $attributes['button_text'] ); ?>
						</span>
					</button>
				</div>
			</form>
		</div>
		<?php
		return ob_get_clean();
	}
}
