<?php
$label = $attributes['label'] ?? __( 'Next', 'surecart' );
$block_id = (int) $block->context["surecart/product-list/blockId"] ?? '';
$page_key = isset( $block_id ) ? 'products-' . $block_id . '-page' : 'products-page';
$page = empty( $_GET[ $page_key ] ) ? 1 : (int) $_GET[ $page_key ];
?>

<a
	<?php echo get_block_wrapper_attributes(); ?>
	href="<?php echo esc_url( add_query_arg( $page_key, $page + 1 ) ); ?>"
	data-wp-key="product-pagination-next"
	data-wp-on--click="surecart/product-list::actions.navigate"
	data-wp-on--mouseenter="surecart/product-list::actions.prefetch"
	data-wp-watch="surecart/product-list::callbacks.prefetch"
	data-wp-class--disabled="!context.hasNextPage"
>
	<?php echo $label; ?>
</a>
