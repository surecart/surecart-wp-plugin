<div <?php echo wp_kses_data(get_block_wrapper_attributes()); ?>>
	<?php foreach ($products as $product) : ?>
		<div <?php echo wp_kses_data(
					wp_interactivity_data_wp_context(
						[
							'product' => $product,
						]
					)
				); ?>>
			<?php echo $content; ?>
		</div>
	<?php endforeach; ?>
</div>
