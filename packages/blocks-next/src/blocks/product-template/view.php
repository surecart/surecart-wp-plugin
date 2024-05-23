<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
	<template
		data-wp-each--product="context.products"
		data-wp-each-key="context.product.id"
		>
		<div class="sc-product-item sc-has-animation-fade-up">
			<a data-wp-bind--href="context.product.permalink" class="sc-product-item-link">
				<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</a>
		</div>
	</template>

	<div data-wp-bind--hidden="context.hasProducts" class="sc-no-products-found">
		<?php esc_html_e( 'No products found.', 'surecart' ); ?>
	</div>
</div>
