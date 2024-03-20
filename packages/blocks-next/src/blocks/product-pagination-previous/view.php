<?php
$label = $attributes['label'] ?? __( 'Previous', 'surecart' );
$block_id = $block->context["surecart/product-list/blockId"];
$page_key = isset( $block_id ) ? 'products-' . $block_id . '-page' : 'products-page';
$page = empty( $_GET[ $page_key ] ) ? 1 : (int) $_GET[ $page_key ];

echo sprintf(
    '<a href="%1$s" %2$s style="%3$s">%4$s</a>',
    esc_url( add_query_arg( $page_key, $page - 1 ) ),
    get_block_wrapper_attributes(),
    esc_attr( $style ),
    $label
);
