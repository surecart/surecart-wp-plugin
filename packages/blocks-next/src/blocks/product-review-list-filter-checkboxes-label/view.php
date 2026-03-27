<span
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'id' => 'review-filter-checkboxes-label',
			]
		)
	);
	?>
>
	<?php echo wp_kses_post( $attributes['label'] ); ?>
</span>

