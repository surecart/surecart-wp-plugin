<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?> data-wp-bind--hidden="!context.hasProducts" hidden>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>
