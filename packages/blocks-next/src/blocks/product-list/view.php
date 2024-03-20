<div 
	<?php echo wp_kses_data(get_block_wrapper_attributes( array( 'class' => 'product-item-list' . $class ) ) ); ?>
	data-wp-interactive='{ "namespace": "surecart/product-list" }'
	style="<?php 
		echo '--sc-product-item-list-column:' . $columns . '; ';
		echo 'gap:' . $block_gap_css_var . '; ';  
		echo esc_attr($style); 
	?>"
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
