<div class="wp-block-buttons">
	<div class="wp-block-button <?php echo esc_attr( $width_class ); ?>" style="<?php echo esc_attr( $wrapper_style ); ?>">
		<div
			<?php
			echo wp_kses_data(
				get_block_wrapper_attributes(
					array_filter(
						[
							'role'                => 'button',
							'tabindex'            => '0',
							'aria-disabled'       => empty( $product->in_stock ) ? 'true' : null,
							'disabled'            => empty( $product->in_stock ) ? 'true' : null,
							'aria-label'          => empty( $product->in_stock ) ? __( 'Sold Out', 'surecart' ) : __( 'Add to Cart', 'surecart' ),
							'data-wp-class--sc-button__link--busy' => 'state.loading',
							'style'               => $style,
							'class'               => 'wp-block-button__link sc-button__link ',
							'data-wp-on--click'   => 'callbacks.handleSubmit',
							'data-wp-on--keydown' => 'callbacks.handleSubmit',
						],
						function ( $value ) {
							return null !== $value;
						}
					)
				)
			);
			?>
		>
			<?php if ( $show_loading_indicator ) { ?>
				<span class="sc-spinner" aria-hidden="true"></span>
			<?php } ?>
			
			<?php if ( $show_icon && 'before' === $icon_position ) { ?>
				<?php
				echo wp_kses(
					SureCart::svg()->get(
						$icon,
						[
							'class' => 'wp-block-surecart-product-quick-view-button__icon sc-button__link-text',
						]
					),
					sc_allowed_svg_html()
				);
				?>
			<?php } ?>

			<?php if ( $show_text ) { ?>
				<span class="sc-button__link-text">
					<?php echo esc_html( empty( $product->in_stock ) ? __( 'Sold Out', 'surecart' ) : $label ); ?>
				</span>
			<?php } ?>

			<?php if ( $show_icon && 'after' === $icon_position ) { ?>
				<?php
				echo wp_kses(
					SureCart::svg()->get(
						$icon,
						[
							'class' => 'wp-block-surecart-product-quick-view-button__icon sc-button__link-text',
						]
					),
					sc_allowed_svg_html()
				);
				?>
			<?php } ?>
			</div>
	</div>
</div>