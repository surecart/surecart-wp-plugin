<div <?php echo wp_kses_data(
	get_block_wrapper_attributes(
		array(
			'class' => $class,
			'style' => $style,
		)
	)
); ?>>
	<?php echo wp_kses_post( sc_get_product_featured_image( 'large', [ 'loading' => 'eager' ] ) ); ?>
</div>
