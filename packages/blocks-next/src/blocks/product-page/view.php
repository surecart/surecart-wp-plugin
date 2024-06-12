
<form
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	<?php
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			array(
				'formId'                       => \SureCart::forms()->getDefaultId(),
				'mode'                         => \SureCart\Models\Form::getMode( \SureCart::forms()->getDefaultId() ),
				'checkoutUrl'                  => \SureCart::pages()->url( 'checkout' ),
				'product'                      => $product,
				'prices'                       => $product->active_prices,
				'selectedPrice'                => $product->initial_price,
				'variant_options'              => $product->variant_options->data ?? array(),
				'variants'                     => $product->variants->data ?? array(),
				'selectedVariant'              => $product->first_variant_with_stock ?? null,
				'quantity'                     => 1,
				'selectedDisplayAmount'        => $product->display_amount,
				'selectedScratchDisplayAmount' => ! empty( $product->initial_price ) ? $product->initial_price->scratch_display_amount : '',
				'isOnSale'                     => ! empty( $product->initial_price ) ? $product->initial_price->is_on_sale : false,
				'busy'                         => false,
				'adHocAmount'                  => ( ! empty( $product->initial_price->ad_hoc ) ? $product->initial_price->amount : 0 ) / ( ! empty( $product->initial_price->is_zero_decimal ) ? 1 : 100 ),
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
	data-wp-interactive='{ "namespace": "surecart/product-page" }'
	data-wp-on--submit="callbacks.handleSubmit"
>
	<?php echo do_blocks( $content );  // phpcs:ignore WordPress.Security.EscapeOutput ?>
</form>
