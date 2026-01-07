<?php
$hide_added_items = $attributes['hideAddedItems'] ?? true;
?>
<div
	<?php
	echo wp_kses_data(
		get_block_wrapper_attributes(
			array(
				'class' => 'sc-cart-order-bumps',
			)
		)
	);
	?>
	data-wp-interactive='{ "namespace": "surecart/order-bumps" }'
	data-wp-init="callbacks.init"
	data-wp-bind--hidden="!state.hasOrderBumps"
	data-wp-context='<?php echo esc_attr( wp_json_encode( array( 'hideAddedItems' => $hide_added_items ) ) ); ?>'
	hidden
>
	<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
</div>
