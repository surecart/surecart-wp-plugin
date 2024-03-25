<div 
    <?php echo get_block_wrapper_attributes(); ?> 
    data-wp-interactive='{ "namespace": "surecart/product-list" }'
    data-wp-router-region="<?php echo 'products-' . $block_id ?>"
    data-wp-init="callbacks.setQueryRef"
    <?php echo wp_kses_data(
        wp_interactivity_data_wp_context(
            [
                'hasPreviousPage' => $products->hasPreviousPage(), 
                'hasNextPage' => $products->hasNextPage(),
                'pages' => $pages,
                'blockId' => $block_id,
            ]
        )
    ); ?>
>
    <?php echo $content; ?>
</div>