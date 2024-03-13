<div <?php echo get_block_wrapper_attributes(['class' => 'wp-block-button']); ?>
	<?php echo wp_kses_data( wp_interactivity_data_wp_context( [
		'checkoutUrl' =>  esc_url( \SureCart::pages()->url( 'checkout' ) ),
		'text' => esc_attr($attributes['text'] ?? __('Add To Cart', 'surecart')),
		'outOfStockText' => esc_attr($attributes['out_of_stock_text'] ?? __('Sold Out', 'surecart')),
	 ] ) ); ?>>
	<a
		class="wp-block-button__link wp-element-button sc-button__link"
		data-wp-bind--href="state.checkoutUrl"
		data-wp-bind--disabled="state.isUnavailable"
		<?php echo ($attributes['add_to_cart'] ?? false) ? 'data-wp-on--click="actions.addToCart"' : ''; ?>
		<?php echo ($attributes['add_to_cart'] ?? false) ? 'data-wp-class--sc-button__link--busy="state.busy"' : ''; ?>
	>
		<span class="sc-spinner" aria-hidden="true"></span>
		<span class="sc-button__link-text" data-wp-text="state.buttonText">
			<?php echo wp_kses_post( $attributes['text'] ?? __('Add To Cart', 'surecart') ); ?>
		</span>
	</a>
</div>
