<figure
<?php
echo wp_kses_data(
	get_block_wrapper_attributes(
		array(
			'class' => $class,
			'style' => $style,
		)
	)
);
?>
>
	<?php echo wp_kses( $product_image_html, sc_allowed_image_html() ); ?>
</figure>
