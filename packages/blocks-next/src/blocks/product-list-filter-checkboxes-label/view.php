<span
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'id' => 'filter-checkboxes-label-' . $block->context['taxonomySlug'] . '-' . $sc_query_id,
			]
		)
	);
	?>
>
	<?php echo wp_kses_post( $attributes['label'] ); ?>
</span>

