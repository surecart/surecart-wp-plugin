<div
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	<?php
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			array(
				// 'urlPrefix' => sc_product_list_prefix( $block ),
				'reviews' => $reviews,
			)
		)
	);
	?>
>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	<div class="sc-block-ui" data-wp-bind--hidden="!state.loading" hidden></div>
</div>
