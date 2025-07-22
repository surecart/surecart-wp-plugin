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
		data-wp-bind--hidden="!state.selectedVariantImage.src"
		data-wp-bind--src="state.selectedVariantImage.src"
		data-wp-bind--alt="state.selectedVariantImage.alt"
		data-wp-bind--srcset="state.selectedVariantImage.srcset"
		data-wp-bind--sizes="state.selectedVariantImage.sizes"
		loading="state.selectedVariantImage.loading"
	/>
</figure>