<div <?php echo wp_kses_data(
	get_block_wrapper_attributes(
		[
			'role'                            => 'button',
			'tabindex'                        => '0',
			'data-wp-on--click'               => 'callbacks.onQuantityDecrease',
			'data-wp-bind--disabled'          => 'state.isQuantityDecreaseDisabled',
			'data-wp-bind--aria-disabled'     => 'state.isQuantityDecreaseDisabled',
			'data-wp-class--button--disabled' => 'state.isQuantityDecreaseDisabled',
			'aria-label'                      => esc_html__( 'Decrease quantity by one.', 'surecart' ),
			'data-wp-on--keydown'             => 'callbacks.onQuantityDecrease',
		]
	)
); ?>>
	<?php echo wp_kses( SureCart::svg()->get( 'minus' ), sc_allowed_svg_html() ); ?>
</div>
