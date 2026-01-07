<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php echo nl2br( esc_html( $block->context['review']->body ?? '' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>
