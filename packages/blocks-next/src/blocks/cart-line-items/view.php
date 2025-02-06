<div
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	role="list"
>
	<template
		data-wp-each--line_item="state.checkoutLineItems"
		data-wp-each-key="context.line_item.id"
	>
		<div class="sc-product-line-item" role="listitem">
			<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
		<?php if ( $attributes['divider_enabled'] ) : ?>
			<hr class="sc-cart-items-divider" />
		<?php endif; ?>
	</template>
</div>
