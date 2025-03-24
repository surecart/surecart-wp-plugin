<div 
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	data-wp-interactive='{ "namespace": "surecart/product-quick-view" }'
>
	<?php echo do_blocks( $content );  // phpcs:ignore WordPress.Security.EscapeOutput ?>
</div>
