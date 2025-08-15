<div
	<?php echo wp_kses_data(
		get_block_wrapper_attributes(
			array(
				'role' => 'list',
			)
		)
	); ?>
>
	<template
		data-wp-each--line_item="state.checkoutLineItems"
		data-wp-each-key="context.line_item.id"
	>
		<div class="sc-product-line-item" data-wp-class--sc-product-line-item--has-swap="state.swap" role="listitem">
			<div class="sc-product-line-item__content">
				<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</div>
			<div class="sc-product-line-item__swap" data-wp-bind--hidden="!state.swap" hidden data-wp-on--click="actions.toggleSwap">
				<div class="sc-product-line-item__swap-content">
				<button type="button" class="sc-toggle" role="switch" aria-checked="false" data-wp-bind--aria-checked="context.line_item.swap" data-wp-class--sc-toggle--checked="context.line_item.swap">
					<span class="sc-toggle__label"><?php esc_html_e( 'Use setting', 'surecart' ); ?></span>
					<span aria-hidden="true" class="sc-toggle__knob"></span>
					</button>
					<span data-wp-text="state.swap.description"></span>
				</div>
				<div class="sc-product-line-item__swap-amount">
					<span data-wp-text="state.swapDisplayAmount" class="sc-product-line-item__swap-amount-value"></span>
					<span data-wp-text="state.swapIntervalText" class="sc-product-line-item__swap-amount-interval"></span>
					<span data-wp-text="state.swapIntervalCountText" class="sc-product-line-item__swap-amount-interval-count"></span>
				</div>
			</div>
		</div>
	</template>
</div>
