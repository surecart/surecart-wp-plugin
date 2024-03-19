<div 
	<?php echo wp_kses_data(get_block_wrapper_attributes( array( 'class' => 'product-item-list' . $class ) ) ); ?>
	data-wp-interactive='{ "namespace": "surecart/product-list" }'
	style="<?php echo $attributes['columns'] ? '--sc-product-item-list-column:' . $attributes['columns'] : '';  echo esc_attr($style); ?>"
>
	<?php foreach ($products as $product) : ?>
		<div
			class="product-item" 
			<?php echo wp_kses_data(
					wp_interactivity_data_wp_context(
						[
							'product' => $product,
						]
					)
			); ?>
		>
			<?php echo $content; ?>
		</div>
	<?php endforeach; ?>
</div>
