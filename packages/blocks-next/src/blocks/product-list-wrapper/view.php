<div 
	<?php echo wp_kses_data(get_block_wrapper_attributes()); ?> 
	<?php echo wp_kses_data(
		wp_interactivity_data_wp_context(
			[
				'products' => $products,
			]
		)
	); ?>
	data-wp-interactive='{ "namespace": "surecart/product-list" }'
>
	<?php echo $content; ?>
</div>
