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
	data-wp-on--click="surecart/order-bumps::actions.nextPage"
	data-wp-on--keydown="surecart/order-bumps::actions.handleNextKeydown"
	data-wp-bind--disabled="!state.hasNextPage"
	data-wp-bind--aria-disabled="!state.hasNextPage"
	aria-label="<?php esc_attr_e( 'Next page', 'surecart' ); ?>"
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
				'class'       => 'wp-block-surecart-cart-order-bump-pagination-next__icon',
				'aria-hidden' => 'true',
			]
		),
		sc_allowed_svg_html()
	);
	?>
</div>
