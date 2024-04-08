<div
	<?php echo get_block_wrapper_attributes( array( 'class' => 'product-item-list' . $class ) ); ?>
	style="<?php
		echo '--sc-product-item-list-column:' . $columns . '; ';
		echo esc_attr($style);
	?>"
>
	<?php if ( empty( $products ) ) : ?>
		<div class="no-products-found">
			<?php esc_html_e( 'No products found.', 'surecart' ); ?>
		</div>
	<?php endif; ?>
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
