<div
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
	<?php echo wp_kses( sc_get_product_featured_image( 'medium_large', [ 'loading' => 'eager' ] ), sc_allowed_image_html() ); ?>
</div>
