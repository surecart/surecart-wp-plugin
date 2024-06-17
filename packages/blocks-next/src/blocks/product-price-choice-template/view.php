	<div
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			array( 'class' => 'sc-choice' )
		)
	);

	?>


>
<?php echo $content; ?>
</div>
