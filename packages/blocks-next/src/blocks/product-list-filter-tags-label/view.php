<span
	<?php echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'id' => 'filter-tags-label-' . $sc_query_id,
			]
		)
	); ?>
>
	<?php echo wp_kses_post( $attributes['label'] ); ?>
</span>

