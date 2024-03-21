<div 
	<?php echo wp_kses_data(get_block_wrapper_attributes( array( 'class' => 'product-item-list' . $class ) ) ); ?>
	style="<?php 
		echo '--sc-product-item-list-column:' . $columns . '; ';
		echo 'gap:' . $block_gap_css_var . '; ';  
		echo esc_attr($style); 
	?>"
>
	<?php foreach ($products as $product) : ?>
		<div
			<?php echo wp_kses_data(
					wp_interactivity_data_wp_context(
						[
							'product' => $product,
						]
					)
			); ?>
			class="product-item"
		>
			<?php echo $content ?>
		</div>
	<?php endforeach; ?>
</div>
