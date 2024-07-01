<div
	<?php echo wp_kses_data(
		get_block_wrapper_attributes(
			array(
				'style' => $style,
			)
		)
	); ?>
>
	<button
		class="wp-block-surecart-cart-header-v2__close"
		data-wp-on--click="surecart/cart::actions.toggle"
	>
		<?php echo wp_kses( SureCart::svg()->get( 'arrow-right' ), sc_allowed_svg_html() ); ?>
	</button>

	<span class="wp-block-surecart-cart-header-v2__title" id="sc-cart-title">
		<?php echo esc_html( $attributes['text'] ); ?>
	</span>

	<div class="sc-tag sc-tag--default">
		<span data-wp-text="surecart/checkout::state.getItemsCount"></span>
	</div>
</div>
