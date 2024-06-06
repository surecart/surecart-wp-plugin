<div
	<?php echo wp_kses_data( get_block_wrapper_attributes(
		[
			'class' => 'wp-block-button ' . $class,
			'style' => 'width: 100%; ' . $style,
		]
	) ); ?>
	data-wp-interactive='{ "namespace": "surecart/checkout" }'

	<?php echo wp_interactivity_data_wp_context( [
		'checkoutUrl' =>  esc_url( \SureCart::pages()->url( 'checkout' ) ),
		'text' => esc_attr($attributes['text'] ?? __('Add To Cart', 'surecart')),
		'outOfStockText' => esc_attr($attributes['out_of_stock_text'] ?? __('Sold Out', 'surecart')),
		'addToCart' => $attributes['add_to_cart'] ?? true,
	 ] ); ?>>
	<button
		class="wp-block-button__link wp-element-button sc-button__link <?php echo esc_attr($class); ?>"
		style="<?php echo esc_attr($style); ?>"
		data-wp-bind--disabled="state.isUnavailable"
		data-wp-bind--value="state.checkoutUrl"
		data-wp-on--click="surecart/checkout::actions.addToCart"
		<?php echo $attributes['add_to_cart'] ? 'data-wp-class--sc-button__link--busy="state.busy"' : ''; ?>
	>
		<span class="sc-spinner" aria-hidden="true"></span>
		<span class="sc-button__link-text">
			<?php echo wp_kses_post( $attributes['text'] ?? __('Add To Cart', 'surecart') ); ?>
		</span>
	</button>
</div>
