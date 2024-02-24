
<div
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	data-wp-interactive='{ "namespace": "surecart/product" }'
	data-wp-context='{ "productId": "<?php echo esc_attr( $product_id ); ?>" }'
	data-wp-watch--variant-values="callbacks.updateVariantAndValues"
>
	<?php echo do_blocks( $content ); ?>
</div>
