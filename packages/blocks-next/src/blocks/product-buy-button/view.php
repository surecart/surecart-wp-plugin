<div <?php echo get_block_wrapper_attributes(['class' => 'wp-block-button']); ?>
	data-wp-context='<?php echo wp_json_encode([
		'checkoutUrl' =>  esc_url( \SureCart::pages()->url( 'checkout' ) ),
		'text' => esc_attr($attributes['text'] ?? __('Add To Cart', 'surecart')),
		'outOfStockText' => esc_attr($attributes['out_of_stock_text'] ?? __('Sold Out', 'surecart')),
	], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP ); ?>'
	>
	<a
		class="wp-block-button__link wp-element-button sc-button__link"
		data-wp-bind--href="state.checkoutUrl"
		data-wp-bind--disabled="state.isUnavailable"
		data-wp-on--click="actions.addToCart"
		data-wp-class--sc-button__link--busy="state.busy"
	>
		<span class="sc-spinner" aria-hidden="true"></span>
		<span class="sc-button__link-text" data-wp-bind--text="state.buttonText">
			<?php echo wp_kses_post( $attributes['text'] ?? __('Add To Cart', 'surecart') ); ?>
		</span>
	</a>
</div>
