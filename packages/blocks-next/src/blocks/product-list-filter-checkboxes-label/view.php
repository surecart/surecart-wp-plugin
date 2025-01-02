<span
	<?php echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'aria-label' => wp_strip_all_tags( $attributes['label'] ),
			]
		)
	); ?>
>
	<?php echo wp_kses_post( $attributes['label'] ); ?>
</span>

