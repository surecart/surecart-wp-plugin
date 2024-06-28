<div <?php echo wp_kses_data( get_block_wrapper_attributes( array( 'class' => 'sc-pill-option__wrapper' ) ) ); ?>>
	<template data-wp-each--option_value="context.optionValues" data-wp-key="context.option_value">
		<div>
			<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput ?>
		</div>
	</template>
</div>
