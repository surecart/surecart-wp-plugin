<div
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			array(
				'class' => 'wp-block-button ' . esc_attr( $width_class ),
			)
		)
	);
	?>
>
	<button
		class="wp-block-button__link wp-element-button sc-button__link <?php echo ! empty( $styles['classnames'] ) ? esc_attr( $styles['classnames'] ) : ''; ?>"
		data-wp-bind--disabled="context.busy"
		data-wp-class--sc-button__link--busy="context.busy"
		style="<?php echo ! empty( $styles['css'] ) ? esc_attr( $styles['css'] ) : ''; ?>"
		type="submit"
	>
		<span class="sc-spinner" aria-hidden="true" data-wp-bind--hidden="!context.busy"></span>
		<span class="sc-button__link-text"><?php echo wp_kses_post( $attributes['text'] ?? __( 'Submit Review', 'surecart' ) ); ?></span>
	</button>
</div>