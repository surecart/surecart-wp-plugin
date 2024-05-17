<div
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	data-wp-interactive='{ "namespace": "surecart/product-list" }'
	data-wp-router-region="<?php echo esc_attr( 'products-' . $block_id ); ?>"
	<?php
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			[
				'nextPageLink'     => $next_page_link,
				'previousPageLink' => $previous_page_link,
				'pages'            => $pagination_pages,
				'blockId'          => $block_id,
				'autoScroll'       => (bool) $attributes['pagination_auto_scroll'] ?? true,
				'products'         => $products->data,
				'hasProducts'      => ! empty( $products->total() ),
			]
		)
	);
	?>
>
	<?php echo $content; ?>

	<div class="sc-block-ui" data-wp-bind--hidden="!state.loading" hidden></div>
</div>
