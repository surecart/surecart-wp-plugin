
<template
	data-wp-each--fee="state.lineItemFees"
	data-wp-each-key="context.fee.id"
>
	<div <?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>>
		<span
			<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
			data-wp-text="context.fee.display_amount"
		></span>
		<span
			<?php echo wp_kses_data( get_block_wrapper_attributes() ); ?>
			data-wp-text="context.fee.description"
		></span>
	</div>
</template>
