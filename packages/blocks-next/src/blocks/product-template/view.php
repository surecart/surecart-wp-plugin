<div <?php echo get_block_wrapper_attributes(); ?>>
	<template
		data-wp-each--product="context.products"
		data-wp-each-key="context.product.id">
		<div class="product-item">
			<a data-wp-bind--href="context.product.permalink" class="product-item-link">
				<?php echo $content ?>
			</a>
		</div>
	</template>

	<div data-wp-bind--hidden="context.hasProducts" class="no-products-found">
		<?php esc_html_e( 'No products found.', 'surecart' ); ?>
	</div>
</div>
