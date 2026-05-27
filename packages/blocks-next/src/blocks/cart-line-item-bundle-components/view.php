<div
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			array(
				'class'                => 'sc-cart-line-item-bundle-components',
				'data-wp-bind--hidden' => '!state.hasBundleComponents',
				'data-wp-class--sc-cart-line-item-bundle-components--clickable' => 'state.hasBundleComponentsOverflow',
				'data-wp-class--sc-cart-line-item-bundle-components--is-expanded' => 'context.bundleComponentsExpanded',
				'data-wp-bind--tabindex' => 'state.bundleComponentsRowTabindex',
				'data-wp-on--click'      => 'actions.toggleBundleComponentsExpandedFromRow',
				'data-wp-on--keydown'    => 'actions.toggleBundleComponentsExpandedFromRow',
				'data-wp-context'      => wp_json_encode(
					array(
						'showSingleQuantity'       => (bool) ( $attributes['showSingleQuantity'] ?? false ),
						'bundleComponentsExpanded' => false,
					)
				),
			)
		)
	);
	?>
>
	<div class="sc-cart-line-item-bundle-components__list">
		<template
			data-wp-each--bundle_component="state.bundleComponentsHead"
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

		<template
			data-wp-each--bundle_component="state.bundleComponentsTail"
			data-wp-each-key="context.bundle_component.id"
		>
			<div
				class="sc-cart-line-item-bundle-components__item"
				data-wp-bind--hidden="!context.bundleComponentsExpanded"
			>
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

	<button
		type="button"
		class="sc-cart-line-item-bundle-components__toggle"
		data-wp-bind--hidden="!state.hasBundleComponentsOverflow"
		data-wp-bind--aria-expanded="context.bundleComponentsExpanded"
		data-wp-bind--aria-label="state.bundleComponentsToggleLabel"
		data-wp-bind--title="state.bundleComponentsToggleLabel"
		data-wp-on--click="actions.toggleBundleComponentsExpanded"
	>
		<svg
			class="sc-cart-line-item-bundle-components__toggle-icon"
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<polyline points="6 9 12 15 18 9"></polyline>
		</svg>
	</button>
</div>
