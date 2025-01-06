<figure <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<?php
	echo wp_kses_post(
		$featured_image->html(
			'large',
			array(
				'loading' => 'eager',
				'style'   => ! empty( $width ) ? 'max-width: min(' . esc_attr( $width ) . ', 100%)' : '',
			)
		)
	);
	?>
</figure>
