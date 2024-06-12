<div
	<?php echo wp_kses_data(
		get_block_wrapper_attributes(
			array(
				'class' => 'sc-choice',
			)
		)
	); ?>
	data-wp-on--click="callbacks.setPrice"
	data-wp-class--sc-choice--checked="state.isPriceSelected"
	data-wp-bind--aria-checked="state.isPriceSelected"
	tabindex="0"
	role="radio">
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput ?>
</div>
