<div class="wp-block-buttons">
	<div class="wp-block-button <?php echo esc_attr( $width_class ); ?>" style="<?php echo esc_attr( $wrapper_style ); ?>">
		<div
			<?php
			echo wp_kses_data(
				get_block_wrapper_attributes(
					array_filter(
						[
							'role'              => 'button',
							'tabindex'          => '0',
							'aria-disabled'     => $product->is_sold_out ? 'true' : null,
							'disabled'          => $product->is_sold_out ? 'true' : null,
							'aria-label'        => __( 'Add to Cart', 'surecart' ),
							'data-wp-class--sc-button__link--busy' => 'context.busy',
							'style'             => $style,
							'class'             => 'wp-block-button__link sc-button__link ',
							'data-wp-on--click' => 'callbacks.handleSubmit',
						],
						function ( $value ) {
							return null !== $value;
						}
					)
				)
			);
			?>
		>
			<span class="sc-spinner" aria-hidden="true"></span>
			
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
					<?php echo esc_html( $product->is_sold_out ? __( 'Sold Out', 'surecart' ) : $label ); ?>
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