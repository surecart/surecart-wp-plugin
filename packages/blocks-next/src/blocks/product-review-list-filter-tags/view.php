<div
<?php
echo wp_kses_data(
	get_block_wrapper_attributes(
		[
			'class'       => empty( $all_stars ) ? 'is-empty' : '',
			'aria-hidden' => empty( $all_stars ) ? 'true' : 'false',
		]
	)
);
?>
>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>
