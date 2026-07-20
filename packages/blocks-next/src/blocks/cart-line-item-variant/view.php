<div
	data-wp-interactive='{ "namespace": "surecart/checkout" }'
	<?php
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			array(
				'showBundleVariantsOnly' => ! ( $attributes['showAllBundleItems'] ?? true ),
				'bundleSeparator'        => $attributes['separator'] ?? '·',
			)
		)
	);
	?>
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
				class="sc-cart-line-item-variant__qty"
				data-wp-bind--hidden="!state.lineItemBundleComponentQty"
				data-wp-text="state.lineItemBundleComponentQty"
			></span>
			<span
				class="sc-cart-line-item-variant__name"
				data-wp-text="state.lineItemBundleComponentName"
			></span>
			<span
				class="sc-cart-line-item-variant__variant"
				data-wp-bind--hidden="!state.lineItemBundleComponentVariant"
				data-wp-text="state.lineItemBundleComponentVariant"
			></span>
		</div>
	</template>
</div>
