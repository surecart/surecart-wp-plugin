<ul
	<?php echo wp_kses_data( get_block_wrapper_attributes( [ 'role' => 'list' ] ) ); ?>
	data-wp-class--has-overflow="state.hasMultipleBumps"
	data-wp-on-async--scrollend="callbacks.onCarouselScroll"
	data-wp-on--keydown="actions.handleCarouselKeydown"
	tabindex="0"
	data-wp-bind--aria-label="state.orderBumpsListAriaLabel"
	aria-label="<?php esc_attr_e( 'Order bumps carousel. Use left and right arrow keys to navigate.', 'surecart' ); ?>"
>
	<template
		data-wp-each--bump="state.orderBumps"
		data-wp-each-key="context.bump.id"
	>
		<li class="sc-cart-order-bump-item" role="listitem">
			<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</li>
	</template>
</ul>
