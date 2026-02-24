<figure class="sc-cart-order-bump-image-wrap" data-wp-bind--hidden="!context.bump.price.product.line_item_image.src">
	<img
		<?php echo wp_kses_data(
			get_block_wrapper_attributes(
				array(
					'class' => $class,
					'style' => $style,
				)
			)
		); ?>
		data-wp-bind--alt="context.bump.price.product.name"
		data-wp-bind--src="context.bump.price.product.line_item_image.src"
		loading="lazy"
	/>
</figure>
