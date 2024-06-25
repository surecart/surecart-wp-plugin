<a
	data-wp-interactive='{ "namespace": "surecart/checkout" }'
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	<?php
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			[
				'formId' => intval( $form->ID ),
				'mode'   => esc_attr( $form_mode ),
			]
		)
	);
	?>
	data-wp-on--click="surecart/checkout::actions.toggleCartSidebar"
	data-wp-on--keydown="surecart/checkout::actions.toggleCartSidebar"
	tabindex="0"
>
	<div class="sc-cart-container">
		<div class="sc-cart-icon">
			<?php echo wp_kses( SureCart::svg()->get( $icon, [ 'class' => '' ] ), sc_allowed_svg_html() ); ?>
		</div>

		<span
			class="sc-cart-count"
			data-wp-text="state.getItemsCount"
		>
		</span>
	</div>
</a>
