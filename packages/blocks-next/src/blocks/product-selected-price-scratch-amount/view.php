<span class="sc-screen-reader-text" data-wp-bind--aria-hidden="!context.selectedPrice.scratch_display_amount"><?php esc_html_e( 'The price was', 'surecart' ); ?></span>
<div
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	data-wp-text="context.selectedPrice.scratch_display_amount"
	data-wp-bind--hidden="!state.isOnSale"
	hidden
>
</div>
<span class="sc-screen-reader-text" data-wp-bind--aria-hidden="!context.selectedPrice.scratch_display_amount"><?php esc_html_e( 'now discounted to', 'surecart' ); ?></span>
