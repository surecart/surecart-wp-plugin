<div
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	<?php echo $attributes['show_range'] ? 'data-wp-text="context.product.range_display_amount"' : 'data-wp-text="context.product.display_amount"'; ?>
></div>
