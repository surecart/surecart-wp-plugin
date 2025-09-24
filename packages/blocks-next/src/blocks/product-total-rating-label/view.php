<span
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			array( 'class' => empty( $show_label ) ? 'sc-screen-reader-text' : '' )
		)
	);
	?>
>
	<?php echo wp_kses_post( $attributes['label'] ?? __( 'reviews', 'surecart' ) ); ?>
</span>
