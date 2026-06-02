<div
	data-wp-interactive='{ "namespace": "surecart/checkout" }'
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			array(
				'class'                => 'sc-cart-line-item-bundle-components',
				'data-wp-bind--hidden' => '!state.hasBundleComponents',
			)
		)
	);
	?>
>
	<div class="sc-cart-line-item-bundle-components__list">
		<template
			data-wp-each--bundle_component="state.bundleComponents"
			data-wp-each-key="context.bundle_component.id"
		>
			<div class="sc-cart-line-item-bundle-components__item">
				<span
					class="sc-cart-line-item-bundle-components__label"
					data-wp-text="state.lineItemBundleComponent"
				></span>
				<span
					class="sc-cart-line-item-bundle-components__qty"
					data-wp-text="state.lineItemBundleComponentQty"
				></span>
			</div>
		</template>
	</div>
</div>
