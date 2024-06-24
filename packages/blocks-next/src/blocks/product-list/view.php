<div
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	<?php echo wp_kses_data( wp_interactivity_data_wp_context( array( 'blockId' => $block_id ) ) ); ?>
	data-wp-interactive='{ "namespace": "surecart/product-list" }'
	data-wp-router-region="<?php echo esc_attr( 'products-' . $block_id ); ?>"
>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	<div class="sc-block-ui" data-wp-bind--hidden="!state.loading" hidden></div>
	<span id="sc-selection-message" hidden><?php esc_html_e( 'Press the arrow keys then enter to make a selection.', 'surecart' ); ?></span>
	<span id="sc-filter-tag-message" hidden><?php esc_html_e( 'Press enter to remove this filter.', 'surecart' ); ?></span>
</div>
