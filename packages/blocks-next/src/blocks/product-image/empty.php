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
	<img src="<?php echo esc_url( \SureCart::core()->assets()->getUrl() . '/images/placeholder.jpg' ); ?>"
		alt="<?php echo esc_attr( the_title_attribute( [ 'echo' => false ] ) ); ?>"
		width="1180"
		height="1180"/>
</figure>
