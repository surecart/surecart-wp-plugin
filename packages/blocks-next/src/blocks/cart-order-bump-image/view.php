<?php
$width        = $attributes['width'] ?? '80px';
$aspect_ratio = $attributes['aspectRatio'] ?? '1';
$style        = "width: {$width}; aspect-ratio: {$aspect_ratio}; object-fit: cover;";
?>
<figure
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			array(
				'class' => 'sc-cart-order-bump-image-wrap',
			)
		)
	);
	?>
	data-wp-bind--hidden="!context.bump.price.product.line_item_image.src"
>
	<img
		class="sc-cart-order-bump-image"
		style="<?php echo esc_attr( $style ); ?>"
		data-wp-bind--alt="context.bump.price.product.name"
		data-wp-bind--src="context.bump.price.product.line_item_image.src"
		loading="lazy"
	/>
</figure>
