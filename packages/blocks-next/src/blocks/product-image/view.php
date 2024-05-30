<div <?php echo wp_kses_data(
	get_block_wrapper_attributes(
		array(
			'class' => $class,
			'style' => $style,
		)
	)
); ?>>
	<img data-wp-bind--src="context.product.featured_image.src"/>
</div>
