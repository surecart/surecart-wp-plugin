<input
	<?php echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'data-wp-bind--value'         => 'context.quantity',
				'data-wp-on--change'          => 'callbacks.onQuantityChange',
				'data-wp-bind--disabled'      => 'state.isQuantityDisabled',
				'data-wp-bind--aria-disabled' => 'state.isQuantityDisabled',
				'min'                         => '1',
				'step'                        => '1',
				'autocomplete'                => 'off',
				'role'                        => 'spinbutton',
				'type'                        => 'number',
				'aria-label'                  => esc_html__( 'Quantity', 'surecart' ),
			]
		)
	); ?>
/>
