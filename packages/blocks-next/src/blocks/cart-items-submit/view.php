<div class="sc-cart-items-submit__wrapper">
	<div class="wp-block-button">
		<a
		<?php
			echo wp_kses_data(
				get_block_wrapper_attributes(
					array(
						'class' => 'wp-block-button__link wp-element-button sc-button__link',
					)
				)
			);
			?>
			href="<?php echo esc_attr( \SureCart::pages()->url( 'checkout' ) ); ?>"
			class="wp-block-button__link wp-element-button sc-button__link"
			data-wp-bind--disabled="state.loading"
			data-wp-class--sc-button__link--busy="state.loading"
		>
			<span class="sc-spinner" aria-hidden="false"></span>
			<span class="sc-button__link-text"><?php echo wp_kses_post( $attributes['text'] ); ?></span>
		</a>
	</div>
</div>
