<a
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	<?php echo wp_kses_data( get_block_wrapper_attributes([
		'aria-label' => esc_html( $attributes['label'] ),
		'aria-labelledby' => esc_html( $attributes['label'] )
	])  ); ?>
	href="<?php echo $clear_all_url; ?>"
	data-wp-on--click="surecart/product-list::actions.navigate"
	data-wp-on--mouseenter="surecart/product-list::actions.prefetch"
>
	<?php echo wp_kses_post( $attributes['label'] ); ?>
</a>

