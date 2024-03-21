<?php
$label = $attributes['label'] ?? __( 'Previous', 'surecart' );
$block_id = $block->context["surecart/product-list/blockId"];
$page_key = isset( $block_id ) ? 'products-' . $block_id . '-page' : 'products-page';
$page = empty( $_GET[ $page_key ] ) ? 1 : (int) $_GET[ $page_key ];
$previous_page_url = esc_url(add_query_arg($page_key, $page - 1));
$wrapper_attributes = get_block_wrapper_attributes();
$style_attribute = esc_attr($style);

echo sprintf(
    '<a 
        href="%1$s" 
        %2$s 
        style="%3$s" 
        data-wp-key="product-pagination-previous" 
        data-wp-on--click="surecart/product-list::actions.navigate" 
        data-wp-on--mouseenter="surecart/product-list::actions.prefetch" 
        data-wp-watch="surecart/product-list::callbacks.prefetch" 
        data-wp-bind--hidden="!context.hasPreviousPage"
    >
        %4$s
    </a>',
    $previous_page_url,
    $wrapper_attributes,
    $style_attribute,
    $label
);