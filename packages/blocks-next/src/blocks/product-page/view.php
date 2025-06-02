<form
	<?php echo wp_kses_data(
		get_block_wrapper_attributes(
			[
				'data-sc-block-id' => 'product-page',
			]
		)
	); ?>
	<?php
	echo wp_kses_data( wp_interactivity_data_wp_context( $context ) );
	?>
	data-wp-interactive='{ "namespace": "surecart/product-page" }'
	data-wp-on--submit="callbacks.handleSubmit"
	data-wp-init="callbacks.init"
>
	<?php echo do_blocks( $content );  // phpcs:ignore WordPress.Security.EscapeOutput ?>
	
	<?php if ( isset( $attributes['show_sticky_purchase_button'] ) && $attributes['show_sticky_purchase_button'] ) : ?>
		<div class="sc-sticky-purchase-button-container">
			<?php 
			if (!empty($sticky_purchase_button_content)) {
				echo $sticky_purchase_button_content; // phpcs:ignore WordPress.Security.EscapeOutput
			} else {
				// Fallback to direct file inclusion if template loading fails
				$template_path = SURECART_PLUGIN_DIR . '/templates/parts/sticky-purchase-button.html';
				if (file_exists($template_path)) {
					echo do_blocks(file_get_contents($template_path)); // phpcs:ignore WordPress.Security.EscapeOutput
				}
			}
			?>
		</div>
	<?php endif; ?>
</form>
