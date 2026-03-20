<div <?php echo wp_kses_data(
	get_block_wrapper_attributes(
		[
			'role'                            => 'button',
			'tabindex'                        => '0',
			'data-wp-on--click'               => 'callbacks.onQuantityIncrease',
			'data-wp-bind--disabled'          => 'state.isQuantityIncreaseDisabled',
			'data-wp-bind--aria-disabled'     => 'state.isQuantityIncreaseDisabled',
			'data-wp-class--button--disabled' => 'state.isQuantityIncreaseDisabled',
			'aria-label'                      => esc_html__( 'Increase quantity by one.', 'surecart' ),
			'data-wp-on--keydown'             => 'callbacks.onQuantityIncrease',
		]
	)
); ?>>
	<?php echo wp_kses( SureCart::svg()->get( 'plus' ), sc_allowed_svg_html() ); ?>
</div>
