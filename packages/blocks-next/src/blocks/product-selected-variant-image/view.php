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
		data-wp-bind--hidden="!state.selectedVariant.line_item_image.data-src"
		data-wp-bind--src="state.selectedVariant.line_item_image.data-src"
		data-wp-bind--alt="state.selectedVariant.line_item_image.alt"
		data-wp-bind--srcset="state.selectedVariant.line_item_image.srcset"
		data-wp-bind--sizes="state.selectedVariant.line_item_image.sizes"
		loading="lazy"
	/>

	<img
		data-wp-bind--hidden="state.selectedVariant.line_item_image.src"
		data-wp-bind--src="<?php echo esc_attr( $product_featured_image->{'data-src'} ?? '' ); ?>"
		srcset="<?php echo esc_attr( $product_featured_image->{'data-srcset'} ?? '' ); ?>"
		sizes="<?php echo esc_attr( $product_featured_image->{'data-sizes'} ?? '' ); ?>"
		alt="<?php echo esc_attr( $product_featured_image->alt ?? '' ); ?>"
		loading="<?php echo esc_attr( $product_featured_image->loading ?? 'lazy' ); ?>"
		alt="<?php echo esc_attr( $product_featured_image->alt ?? '' ); ?>"
	/>
</figure>