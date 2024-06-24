<a
	data-wp-interactive='{ "namespace": "surecart/checkout" }'
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	<?php
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			[
				'formId'              => intval( $form->ID ),
				'mode'                => esc_attr( $form_mode ),
				'cartMenuAlwaysShown' => ! empty( $attributes['cart_menu_always_shown'] ) ? true : false,
			]
		)
	);
	?>
	data-wp-on--click="surecart/checkout::actions.toggleCartSidebar"
>
	<div class="sc-cart-icon">
		<?php echo wp_kses( $icon, sc_allowed_svg_html() ); ?>
	</div>

	<span
		class="sc-cart-count"
		data-wp-bind--hidden="!state.showCartMenuIcon"
		hidden
		data-wp-text="state.getItemsCount"
	>
	</span>
</a>
