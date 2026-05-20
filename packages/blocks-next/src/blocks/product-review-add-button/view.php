<div class="wp-block-buttons">
<div <?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'class'            => 'wp-block-button ' . esc_attr( $width_class ),
				'data-sc-block-id' => 'product-review-add-button',
			]
		)
	);
	?>
	<?php
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			[
				'product_id'   => $product_id,
				'redirect_url' => $redirect_url,
			],
			'surecart/product-review-form'
		)
	);
	?>
	>
	<div
		role="button"
		tabindex="0"
		aria-label="<?php echo esc_attr__( 'Write a Review', 'surecart' ); ?>"
		data-wp-on--click="actions.open"
		data-wp-on--keydown="actions.open"
		data-wp-interactive='{ "namespace": "surecart/product-review-form" }'
		class="wp-block-button__link wp-element-button sc-button__link <?php echo ! empty( $styles['classnames'] ) ? esc_attr( $styles['classnames'] ) : ''; ?>"
		style="<?php echo ! empty( $button_style ) ? esc_attr( $button_style ) : ''; ?>"
	>
		<?php if ( $show_loading_indicator ) : ?>
			<span class="sc-spinner" aria-hidden="true"></span>
		<?php endif; ?>

		<?php if ( $show_icon && 'before' === $icon_position ) : ?>
			<?php
			echo wp_kses(
				SureCart::svg()->get(
					$icon,
					[
						'class'       => 'wp-block-surecart-product-review-form-button__icon sc-button__link-text',
						'width'       => $icon_size,
						'height'      => $icon_size,
						'aria-hidden' => 'true',
					]
				),
				sc_allowed_svg_html()
			);
			?>
		<?php endif; ?>

		<?php if ( $show_text ) : ?>
			<span class="sc-button__link-text">
				<?php echo esc_html( $label ); ?>
			</span>
		<?php endif; ?>

		<?php if ( $show_icon && 'after' === $icon_position ) : ?>
			<?php
			echo wp_kses(
				SureCart::svg()->get(
					$icon,
					[
						'class'       => 'wp-block-surecart-product-review-form-button__icon sc-button__link-text',
						'width'       => $icon_size,
						'height'      => $icon_size,
						'aria-hidden' => 'true',
					]
				),
				sc_allowed_svg_html()
			);
			?>
		<?php endif; ?>
	</div>
</div>
</div>

<?php \SureCart::block()->reviewForm()->render(); ?>
