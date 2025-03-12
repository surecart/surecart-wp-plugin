<div
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	role="list"
>
	<template
		data-wp-each--line_item="state.checkoutLineItems"
		data-wp-each-key="context.line_item.id"
	>
		<div class="sc-product-line-item" role="listitem">
			<div class="sc-product-line-item__content">
				<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</div>
			<div class="sc-product-line-item-swap">
				<button type="button" class="sc-toggle" role="switch" aria-checked="false" data-wp-bind--aria-clicked="">
					<span class="sc-toggle__label">Use setting</span>
					<span aria-hidden="true" class="sc-toggle__knob"></span>
				</button>
			</div>
		</div>
	</template>
</div>
