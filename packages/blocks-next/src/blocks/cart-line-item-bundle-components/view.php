<div
	<?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => 'sc-cart-line-item-bundle-components' ) ) ); ?>
	data-wp-bind--hidden="!state.hasBundleComponents"
>
	<template
		data-wp-each--bundle_component="state.bundleComponents"
		data-wp-each-key="context.bundle_component.id"
	>
		<div
			class="sc-cart-line-item-bundle-components__item"
			data-wp-text="state.lineItemBundleComponent"
		></div>
	</template>
</div>
