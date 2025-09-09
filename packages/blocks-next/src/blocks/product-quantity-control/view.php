<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?> 
	data-wp-class--quantity--disabled="state.isQuantityDisabled">
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>
