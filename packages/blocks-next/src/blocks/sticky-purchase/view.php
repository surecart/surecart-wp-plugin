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
	?>
>
	<div class="sc-sticky-purchase__content" data-wp-interactive='{ "namespace": "surecart/product-page" }'>
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</div>
</div>