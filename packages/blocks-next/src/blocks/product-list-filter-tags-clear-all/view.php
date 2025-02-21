<a
	<?php echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'aria-label'      => wp_strip_all_tags( $attributes['label'] ),
				'aria-labelledby' => wp_strip_all_tags( $attributes['label'] ),
			]
		)
	); ?>
	href="<?php echo esc_url( $clear_all_url ); ?>"
	data-wp-on--click="surecart/product-list::actions.navigate"
	data-wp-on--mouseenter="surecart/product-list::actions.prefetch"
>
	<?php echo wp_kses_post( $attributes['label'] ); ?>
</a>

