<div <?php echo get_block_wrapper_attributes(
	[
		'class' => 'product-item-list',
	]
); ?>>
	<?php if ( empty( $products ) ) : ?>
		<div class="no-products-found">
			<?php esc_html_e( 'No products found.', 'surecart' ); ?>
		</div>
	<?php endif; ?>

	<?php foreach ($products as $product) : ?>
		<div
			<?php echo wp_interactivity_data_wp_context(
				[
					'product' => $product,
				]
			); ?>
			class="product-item"
		>
			<?php echo $content ?>
		</div>
	<?php endforeach; ?>
</div>
