<ul
	<?php echo wp_kses_data( get_block_wrapper_attributes( [ 'role' => 'list' ] ) ); ?>
	data-wp-class--has-overflow="state.hasMultipleBumps"
	data-wp-on-async--scroll="callbacks.onCarouselScroll"
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
