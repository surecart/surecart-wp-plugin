<ul
	<?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => 'sc-cart-order-bump-template', 'role' => 'list' ) ) ); ?>
	data-wp-class--sc-cart-order-bump-template--has-overflow="state.hasMultipleBumps"
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
