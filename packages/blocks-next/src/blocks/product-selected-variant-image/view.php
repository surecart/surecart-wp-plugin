<figure
	<?php echo wp_kses_data(
		get_block_wrapper_attributes(
			array(
				'class' => $class,
				'style' => $style,
			)
		)
	); ?>
>
	<img
		data-wp-bind--hidden="!state.selectedVariant.line_item_image.src"
		data-wp-bind--src="state.selectedVariant.line_item_image.src"
		data-wp-bind--alt="state.selectedVariant.line_item_image.alt"
		data-wp-bind--srcset="state.selectedVariant.line_item_image.srcset"
		data-wp-bind--sizes="state.selectedVariant.line_item_image.sizes"
		loading="state.selectedVariant.line_item_image.loading"
	/>

	<img
		data-wp-bind--hidden="state.selectedVariant.line_item_image.src"
		src="<?php echo esc_attr( $product_featured_image->src ?? '' ); ?>"
		alt="<?php echo esc_attr( $product_featured_image->alt ?? '' ); ?>"
		srcset="<?php echo esc_attr( $product_featured_image->srcset ?? '' ); ?>"
		sizes="<?php echo esc_attr( $product_featured_image->sizes ?? '' ); ?>"
		loading="<?php echo esc_attr( $product_featured_image->loading ?? 'lazy' ); ?>"
	/>
</figure>