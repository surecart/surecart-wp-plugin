<a
	<?php echo get_block_wrapper_attributes(); ?>
	data-wp-bind--href="context.nextPageLink"
	data-wp-on--click="surecart/product-list::actions.navigate"
	data-wp-on--mouseenter="surecart/product-list::actions.prefetch"
	data-wp-watch="surecart/product-list::callbacks.prefetch"
	data-wp-class--disabled="!context.nextPageLink"
>
	<?php echo wp_kses_post($attributes['label'] ?? __( 'Next', 'surecart' )); ?>
</a>
