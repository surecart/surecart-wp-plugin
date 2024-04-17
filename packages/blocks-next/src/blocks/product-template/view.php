<div <?php echo get_block_wrapper_attributes(); ?>>
	<?php foreach ($products as $product) : ?>
		<div
			class="product-item"
			<?php echo wp_interactivity_data_wp_context(['product' => $product]); ?>
			data-wp-key="<?php echo esc_attr( $product->id ); ?>"
		>
			<?php echo $content ?>
		</div>
	<?php endforeach; ?>
</div>
