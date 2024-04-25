<div
    <?php echo get_block_wrapper_attributes(); ?>
    data-wp-interactive='{ "namespace": "surecart/product-list" }'
    data-wp-router-region="<?php echo 'products-' . $block_id ?>"
    data-wp-init="callbacks.setQueryRef"
    <?php echo  wp_interactivity_data_wp_context(
		[
			'nextPageLink' => $next_page_link,
			'previousPageLink' => $previous_page_link,
			'pages' => $pages,
			'blockId' => $block_id,
			'autoScroll' => (bool) $attributes['pagination_auto_scroll'] ?? true,
			'products' => $products->data,
			'hasProducts' => !empty($products->total()),
		]
	); ?>
>
    <?php echo $content; ?>
</div>
