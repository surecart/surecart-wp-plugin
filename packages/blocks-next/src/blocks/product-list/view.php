<div
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	data-wp-interactive='{ "namespace": "surecart/product-list" }'
	data-wp-router-region="<?php echo esc_attr( 'products-' . $block_id ); ?>"
	data-wp-init="callbacks.setQueryRef"
	<?php
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			[
				'nextPageLink'     => $next_page_link,
				'previousPageLink' => $previous_page_link,
				'pages'            => $pagination,
				'blockId'          => $block_id,
				'products'         => $products,
				'hasProducts'      => ! empty( $products ),
			]
		)
	);
	?>
>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>

	<div class="sc-block-ui" data-wp-bind--hidden="!state.loading" hidden></div>
</div>
