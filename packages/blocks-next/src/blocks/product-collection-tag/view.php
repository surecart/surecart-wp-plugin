<a <?php echo wp_kses_data(
	get_block_wrapper_attributes(
		[
			'class' => 'sc-tag sc-tag--default sc-tag--medium',
			'style' => 'cursor: pointer; text-decoration: none;',
		]
	)
); ?> href="<?php echo esc_url( $url ); ?>">
	<?php echo wp_kses_post( $collection->name ); ?>
</a>
