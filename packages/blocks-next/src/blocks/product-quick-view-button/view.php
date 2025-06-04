<div
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'role'                   => 'button',
				'tabindex'               => '0',
				'aria-disabled'          => empty( $quick_view_link ) ? 'true' : null,
				'aria-label'             => __( 'Quick View Product', 'surecart' ),
				'data-wp-on--click'      => 'actions.open',
				'data-wp-on--keydown'    => 'actions.open',
				'data-wp-on--mouseenter' => 'actions.prefetch',
				'data-wp-interactive'    => '{ "namespace": "surecart/product-quick-view" }',
				'data-wp-class--loading' => 'state.loading',
				'style'                  => $style,
				'class'                  => 'wp-block-button__link wp-block-button ' . $width_class,
			]
		)
	);
	?>
	<?php
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			[
				'url' => sanitize_url( $quick_view_link ),
			]
		)
	);
	?>
>
	<?php
	if ( $show_icon && 'before' === $icon_position ) {
		echo wp_kses( SureCart::svg()->get( $icon, [ 'class' => 'wp-block-surecart-product-quick-view-button__icon' ] ), sc_allowed_svg_html() );
	}

	if ( $show_text ) {
		echo '<span class="sc-quick-view-button-text">' . esc_html( $label ) . '</span>';
	}

	if ( $show_icon && 'after' === $icon_position ) {
		echo wp_kses( SureCart::svg()->get( $icon, [ 'class' => 'wp-block-surecart-product-quick-view-button__icon' ] ), sc_allowed_svg_html() );
	}
	?>
</div>