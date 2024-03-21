
<form
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	<?php echo wp_kses_data( wp_interactivity_data_wp_context( [ 'productId' => $product->id ] ) ); ?>
	data-wp-interactive='{ "namespace": "surecart/product" }'
	data-wp-watch--variant-values="callbacks.updateSelectedVariant"
	data-wp-on--submit="callbacks.handleSubmit"
>
	<?php echo do_blocks( $content ); ?>
</form>
