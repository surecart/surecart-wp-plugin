<div
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	data-wp-bind--hidden="!state.selectedVariant"
>
	<span data-wp-text="state.selectedVariant.option_1"></span>
	<span data-wp-bind--hidden="!state.selectedVariant.option_2"><?php echo esc_html( $separator ); ?></span>
	<span data-wp-text="state.selectedVariant.option_2"></span>
	<span data-wp-bind--hidden="!state.selectedVariant.option_3"><?php echo esc_html( $separator ); ?></span>
	<span data-wp-text="state.selectedVariant.option_3"></span>
</div>
