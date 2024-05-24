<div <?php echo get_block_wrapper_attributes( array( 'class' => 'wp-block-button' ) ); ?>
	<?php
	echo wp_interactivity_data_wp_context(
		array(
			'checkoutUrl'    => esc_url( \SureCart::pages()->url( 'checkout' ) ),
			'text'           => esc_attr( $attributes['text'] ?? __( 'Add To Cart', 'surecart' ) ),
			'outOfStockText' => esc_attr( $attributes['out_of_stock_text'] ?? __( 'Sold Out', 'surecart' ) ),
			'addToCart'      => $attributes['add_to_cart'] ?? true,
		)
	);
	?>
	>
	<button
		class="wp-block-button__link wp-element-button sc-button__link <?php echo esc_attr( $class ); ?>"
		style="<?php echo esc_attr( $style ); ?>"
		data-wp-bind--disabled="state.isUnavailable"
		data-wp-bind--value="state.checkoutUrl"
		data-wp-class--sc-button__link--busy="state.busy"
	>
		<span class="sc-spinner" aria-hidden="false"></span>
		<span class="sc-button__link-text" data-wp-text="state.buttonText">
			<?php echo wp_kses_post( $attributes['text'] ?? __( 'Add To Cart', 'surecart' ) ); ?>
		</span>
	</button>
</div>
