<div class="wp-block-buttons">
	<div class="wp-block-button <?php echo esc_attr( $width_class ); ?>" style="<?php echo esc_attr( $wrapper_style ); ?>">
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
						'style'                  => $style,
						'class'                  => 'wp-block-button__link sc-button__link ',
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
			<?php if ( $show_loading_indicator ) { ?>
				<span class="sc-spinner" aria-hidden="true"></span>
			<?php } ?>
			
			<?php if ( $show_icon && 'before' === $icon_position ) { ?>
				<?php echo wp_kses( SureCart::svg()->get( $icon, [ 'class' => 'wp-block-surecart-product-quick-view-button__icon sc-button__link-text' ] ), sc_allowed_svg_html() ); ?>
			<?php } ?>

			<?php if ( $show_text ) { ?>
				<span class="sc-button__link-text">
					<?php echo esc_html( empty( $product->in_stock ) ? __( 'Sold Out', 'surecart' ) : $label ); ?>
				</span>
			<?php } ?>

			<?php if ( $show_icon && 'after' === $icon_position ) { ?>
				<?php echo wp_kses( SureCart::svg()->get( $icon, [ 'class' => 'wp-block-surecart-product-quick-view-button__icon sc-button__link-text' ] ), sc_allowed_svg_html() ); ?>
			<?php } ?>
		</div>
	</div>
</div>

<?php \SureCart::block()->quickView()->render(); ?>