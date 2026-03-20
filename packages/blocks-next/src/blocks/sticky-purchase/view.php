<div
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'class'                           => 'sc-sticky-purchase',
				'style'                           => $style,
				'data-wp-interactive'             => '{ "namespace": "surecart/sticky-purchase" }',
				'data-wp-class--is-visible'       => 'state.isVisible',
				'data-wp-on-async-window--scroll' => 'callbacks.updateStickyOffsetVariables',
				'data-wp-on-async-window--resize' => 'callbacks.updateStickyOffsetVariables',
				'data-wp-on--transitionend'       => 'callbacks.updateStickyOffsetVariables',
			]
		)
	);
	echo wp_kses_data(
		wp_interactivity_data_wp_context(
			[
				'showStickyPurchaseButton' => $show_sticky_purchase_button,
			]
		)
	);
	?>
>
	<div
		class="sc-sticky-purchase__content"
		data-wp-interactive='{ "namespace": "surecart/product-page" }'
		data-wp-class--sc-sticky-purchase__content__unavailable="surecart/sticky-purchase::state.isContentUnavailable"
	>
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</div>
</div>