<div
    <?php echo get_block_wrapper_attributes(); ?>
    data-wp-interactive='{ "namespace": "surecart/product-list" }'
    data-wp-router-region="<?php echo 'products-' . $block_id ?>"
    data-wp-init="callbacks.setQueryRef"
    <?php echo  wp_interactivity_data_wp_context(
		[
			'hasPreviousPage' => $products->hasPreviousPage(),
			'hasNextPage' => $products->hasNextPage(),
			'totalPages' => $products->totalPages(),
			'pages' => $pages,
			'blockId' => $block_id,
			'products' => $products->data
		]
	); ?>
>
    <?php echo $content; ?>
</div>
