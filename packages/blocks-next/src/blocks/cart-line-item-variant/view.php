<div
	data-wp-interactive='{ "namespace": "surecart/checkout" }'
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	data-wp-bind--hidden="!state.hasLineItemVariantContent"
>
	<div
		class="sc-cart-line-item-variant__option"
		data-wp-bind--hidden="!state.lineItemVariant"
		data-wp-text="state.lineItemVariant"
	></div>
	<template
		data-wp-each--bundle_component="state.bundleComponents"
		data-wp-each-key="context.bundle_component.id"
	>
		<div class="sc-cart-line-item-variant__bundle-item">
			<span
				class="sc-cart-line-item-variant__label"
				data-wp-text="state.lineItemBundleComponent"
			></span>
			<span
				class="sc-cart-line-item-variant__qty"
				data-wp-text="state.lineItemBundleComponentQty"
			></span>
		</div>
	</template>
</div>
