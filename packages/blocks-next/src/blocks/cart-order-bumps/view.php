<div
	<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
	<?php
		echo wp_kses_data(
			wp_interactivity_data_wp_context(
				[
					'hideAddedItems' => $attributes['hideAddedItems'] ?? true,
				]
			)
		);
		?>
	data-wp-interactive='{ "namespace": "surecart/order-bumps" }'
	data-wp-init="callbacks.init"
	data-wp-bind--hidden="!state.hasOrderBumps"
	hidden
>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>
