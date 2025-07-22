<figure class="sc-cart-line-item-image-wrap" data-wp-bind--hidden="!context.line_item.image.src">
	<img
		<?php echo wp_kses_data(
			get_block_wrapper_attributes(
				array(
					'class' => $class,
					'style' => $style,
				)
			)
		); ?>
		data-wp-bind--alt="context.line_item.image.alt"
		data-wp-bind--srcset="context.line_item.image.srcset"
		data-wp-bind--sizes="context.line_item.image.sizes"
		data-wp-bind--src="context.line_item.image.src"
		loading="lazy"
	/>
</figure>
