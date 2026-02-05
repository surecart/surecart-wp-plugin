<div
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'class' => 'has-arrow-type-' . $pagination_arrow,
			]
		)
	);
	?>
	data-wp-on--click="surecart/order-bumps::actions.previousPage"
	data-wp-on--keydown="surecart/order-bumps::actions.handlePreviousKeydown"
	data-wp-bind--disabled="!state.hasPreviousPage"
	data-wp-bind--aria-disabled="!state.hasPreviousPage"
	aria-label="<?php esc_attr_e( 'Previous page', 'surecart' ); ?>"
	role="button"
	tabindex="0"
>
	<?php
	echo wp_kses(
		\SureCart::svg()->get(
			$icon,
			[
				'width'       => $arrow_size,
				'height'      => $arrow_size,
				'class'       => 'wp-block-surecart-cart-order-bump-pagination-previous__icon',
				'aria-hidden' => 'true',
			]
		),
		sc_allowed_svg_html()
	);
	?>
</div>
