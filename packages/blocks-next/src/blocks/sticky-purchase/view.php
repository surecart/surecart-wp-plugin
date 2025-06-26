<div
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'data-wp-interactive' => '{ "namespace": "surecart/sticky-purchase" }',
				'data-wp-init'        => 'callbacks.init',
				'data-wp-context'     => '{}',
				'style'               => $style,
				'class'               => 'sc-sticky-purchase',
			]
		)
	);
	?>
>
	<div data-wp-interactive='{ "namespace": "surecart/product-page" }'>
		<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</div>
</div>