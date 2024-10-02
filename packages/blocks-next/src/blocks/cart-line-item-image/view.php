<img
	<?php echo wp_kses_data(
		get_block_wrapper_attributes(
			array(
				'class' => $class,
				'style' => $style,
			)
		)
	); ?>
	data-wp-bind--hidden="!context.line_item.image.src"
	data-wp-bind--alt="context.line_item.image.alt"
	data-wp-bind--srcset="context.line_item.image.srcset"
	data-wp-bind--sizes="context.line_item.image.sizes"
	loading="lazy"
	alt=""
/>
