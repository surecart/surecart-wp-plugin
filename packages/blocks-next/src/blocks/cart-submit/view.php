<div class="sc-cart-submit__wrapper wp-block-buttons">
	<div
		class="wp-block-button"
		<?php echo wp_kses_data(
			get_block_wrapper_attributes(
				array(
					'style' => $style,
				)
			)
		); ?>
	>
		<a
			href="<?php echo esc_attr( \SureCart::pages()->url( 'checkout' ) ); ?>"
			class="wp-block-button__link wp-element-button sc-button"
		>
			<span><?php echo wp_kses_post( $attributes['text'] ); ?></span>
		</a>
	</div>
</div>
