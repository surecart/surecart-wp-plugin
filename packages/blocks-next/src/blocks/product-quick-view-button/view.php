<div class="wp-block-buttons">
	<div class="wp-block-button" style="<?php echo esc_attr( $wrapper_style ); ?>">
		<div
			<?php
			echo wp_kses_data(
				get_block_wrapper_attributes(
					[
						'role'                   => 'button',
						'tabindex'               => '0',
						'aria-disabled'          => empty( $quick_view_link ) ? 'true' : null,
						'aria-label'             => __( 'Quick Add Product', 'surecart' ),
						'data-wp-on--click'      => 'actions.open',
						'data-wp-on--keydown'    => 'actions.open',
						'data-wp-on--mouseenter' => 'actions.prefetch',
						'data-wp-interactive'    => '{ "namespace": "surecart/product-quick-view" }',
						'data-wp-class--loading' => 'state.loading',
						'style'                  => $style,
						'class'                  => 'wp-block-button__link wp-block-button sc-button__link ' . $width_class,
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
				echo wp_kses( SureCart::svg()->get( $icon, [ 'class' => 'wp-block-surecart-product-quick-view-button__icon sc-button__link-text' ] ), sc_allowed_svg_html() );
			}

			if ( $show_text ) {
				echo '<span class="sc-quick-view-button-text sc-button__link-text">' . esc_html( $label ) . '</span>';
			}

			if ( $show_icon && 'after' === $icon_position ) {
				echo wp_kses( SureCart::svg()->get( $icon, [ 'class' => 'wp-block-surecart-product-quick-view-button__icon sc-button__link-text' ] ), sc_allowed_svg_html() );
			}
			?>
		</div>
	</div>
</div>