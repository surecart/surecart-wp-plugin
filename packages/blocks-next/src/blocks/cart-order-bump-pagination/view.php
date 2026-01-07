<nav
	<?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => 'sc-cart-order-bump-pagination' ) ) ); ?>
	data-wp-bind--hidden="!state.showPagination"
	aria-label="<?php esc_attr_e( 'Order bumps pagination', 'surecart' ); ?>"
	hidden
>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</nav>
